/* global dataLayer, ga */
import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const {
  Evented,
  Service,
  RSVP,
  run,
  computed,
  inject,
  assign,
  isPresent,
  set,
  get
} = Ember;

export default Service.extend(Evented, {
  api: inject.service(),
  userLocation: inject.service(),
  session: inject.service(),
  intercom: inject.service(),
  fastboot: inject.service(),
  clientId: null,
  locationId: computed.alias('userLocation.location.id'),
  _clientIdKey: 'dailyuv_session_client_id',
  logEnabled: config.LOG_TRACKING_EVENTS,

  _waitForClientId: null,

  waitForClientId() {
    return get(this, '_waitForClientId');
  },

  waitForLocationAndClientId() {
    return RSVP.hash({
      location: get(this, 'userLocation.location'),
      clientId: this.waitForClientId()
    });
  },

  init() {
    this._super();
    const deferred = RSVP.defer();
    set(this, '_clientIdDeferred', deferred);
    set(this, '_waitForClientId', deferred.promise);

    deferred.promise.then((id) => {
      set(this, 'clientId', id);
      if(typeof(dataLayer) !== "undefined") {
        dataLayer.push({client_id: id});
      }
    });

    get(this, 'userLocation').on('locationDidChange', (locationId) => {
      if(typeof(dataLayer) !== "undefined") {
        dataLayer.push({location_id: locationId});
      }
    });

    if(!get(this, 'fastboot.isFastBoot')) {
      this._eventuallyGetClientId();
    }
  },

  defaultDataLayerAttrs: computed('locationId', 'clientId', function() {
    return {
      client_id: get(this, 'clientId'),
      user_id: get(this, 'session.currentUser.userId'),
      location_id: get(this, 'locationId')
    };
  }),

  /**
   * by default pushes into dataLayer/GTM
   */
  push(options) {
    if(!get(this, 'fastboot.isFastBoot')) {
      this.waitForLocationAndClientId().then(()=>{
        const trackData = assign(
          {}, get(this, 'defaultDataLayerAttrs'), options
        );

        if(typeof(dataLayer) !== "undefined") {
          dataLayer.push(trackData);
        }
        this.trigger(trackData.event, trackData);
        this.trigger('DataLayerEvent', trackData);

        if(get(this, 'logEnabled') && trackData.event) {
          console.log("[dataLayer Event]: ", trackData.event, trackData);
        }
      });
    }
  },

  contentImpression(content_id, opts = {}) {
    if(!get(this, 'fastboot.isFastBoot')) {
      this.waitForLocationAndClientId().then((data) => {
        const trackData = assign(
          {
            client_id: data.clientId,
            // In some tests, location will be undefined
            location_id: get(data, 'location.id')
          },
          opts
        );

        get(this, 'api').recordContentImpression(
          content_id, trackData
        );

        if(get(this, 'logEnabled')) {
          console.info(`[Impression of content]: ${content_id}`);
        }
      });
    }
  },

  promoImpression(promo, opts = {}) {
    if(!get(this, 'fastboot.isFastBoot')) {
      this.waitForLocationAndClientId().then((data) => {
        const gtmBlocked = typeof window.google_tag_manager === 'undefined';
        const id = get(promo, 'metrics_id') || get(promo, 'id');
        const trackData = assign(
          {
            client_id: data.clientId,
            // In some tests, location will be undefined
            location_id: get(data, 'location.id'),
            gtm_blocked: gtmBlocked
          }, opts);

        get(this, 'api').recordPromoBannerImpression(id, trackData);

        if(get(this, 'logEnabled')) {
          console.info(`[Impression of banner]: ${get(promo, 'id')}, [GTM blocked]: ${gtmBlocked}`);
        }
      });
    }
  },

  promoBannerClick(promo, opts = {}) {
    if(!get(this, 'fastboot.isFastBoot')) {
      this.waitForLocationAndClientId().then((data) => {
        const id = get(promo, 'metrics_id') || get(promo, 'id');
        const trackData = assign(
          {
            client_id: data.clientId,
            // In some tests, location will be undefined
            location_id: get(data, 'location.id')
          }, opts);

        get(this, 'api').recordPromoBannerClick(id, trackData);

        if(get(this, 'logEnabled')) {
          console.info(`[Click banner]: ${get(promo, 'id')}`);
        }
      });
    }

  },

  changeSearchRadius(newRadius, opts) {
    opts = opts || {};
    this.push({
      event: 'ChangeRadius',
      channel: opts['channel'],
      old_value: opts['oldRadius'],
      new_value: newRadius
    });

    get(this, 'intercom').trackEvent('change-radius');
  },

  trackMyStuffClick() {
    this.push({
      event: 'my-stuff-click'
    });
  },

  trackHelpTextClick() {
    this.push({
      event: 'HelpTextClick'
    });
  },

  trackUGCJobsTrayOpened() {
    this.push({
      event: 'UGCJobsTrayOpened'
    });
  },

  trackUGCJobsTrayClosed() {
    this.push({
      event: 'UGCJobsTrayClosed'
    });
  },

  trackUGCJobClick(job) {
    this.push({
      job,
      event: 'UGCJobClick'
    });
  },

  trackCloseModalClickOutside() {
    this.push({
      event: 'CloseModalClickOutside'
    });
  },

  trackCloseModalClickButton() {
    this.push({
      event: 'CloseModalClickButton'
    });
  },

  trackCloseModalSlideAway() {
    this.push({
      event: 'CloseModalSlideAway'
    });
  },

  /** Private **/

  _eventuallyGetClientId() {
    run.cancel(this._gaDelayedCapture);

    let clientId = get(this, 'clientId');
    const deferred = get(this, '_clientIdDeferred');

    if(Ember.testing) {
      deferred.resolve('tester');
    } else if(clientId) {
      deferred.resolve(clientId);
    } else {
      const keyName = get(this, '_clientIdKey');
      clientId = localStorage.getItem(keyName) || null;

      if(isPresent(clientId)) {
        deferred.resolve(clientId);
      } else {
        clientId = this._getClientIdFromGa();

        if(isPresent(clientId)) {
          localStorage.setItem(keyName, clientId);
          deferred.resolve(clientId);
        } else {
          if(get(this, 'logEnabled')) {
            console.log('No client id availble from GA yet');
          }
          // Try again in 3 seconds
          this._gaDelayedCapture = run.later(this, this._eventuallyGetClientId, 3000);
        }
      }
    }
  },

  _getClientIdFromGa() {
    let clientId;

    if (typeof ga !== 'undefined' && typeof ga.getAll !== 'undefined') {
      clientId = ga.getAll()[0].get('clientId');

      if(get(this, 'logEnabled')) {
        console.log('Client ID from GA:', clientId);
      }
    }

    return clientId;
  }

});
