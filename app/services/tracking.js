/* global dataLayer, ga */
import { reads } from '@ember/object/computed';

import Evented from '@ember/object/evented';
import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import { get, set, computed } from '@ember/object';
import config from 'subtext-ui/config/environment';

export default Service.extend(Evented, {
  api: service(),
  userLocation: service(),
  session: service(),
  logger: service(),
  fastboot: service(),
  store: service(),

  clientId: null,
  locationId: reads('userLocation.userLocation.id'),
  _clientIdKey: 'dailyuv_session_client_id',
  logEnabled: config.LOG_TRACKING_EVENTS,
  currentUser: computed(function() {
    return RSVP.Promise.resolve( get(this, 'session.currentUser') );
  }),
  currentController: service(),

  _waitForClientId: null,

  waitForClientId() {
    return get(this, '_waitForClientId');
  },

  waitForLocationAndClientId() {
    return new RSVP.Promise((resolve, reject)=> {
      RSVP.hash({
        location: get(this, 'userLocation.userLocation'),
        clientId: this.waitForClientId()
      }).then((resolvedData) => {
        if(!get(this, 'isDestroying')) {
          resolve(resolvedData);
        }
      }).catch(reject);
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

    get(this, 'userLocation').on('userLocationChanged', (locationId) => {
      const location = get(this, 'store').peekRecord('location', locationId);
      const locationName = isPresent(location) ? get(location, 'name') : '';

      this.chooseDifferentLocation(locationId, locationName);
    });

    if(!get(this, 'fastboot.isFastBoot')) {
      this._eventuallyGetClientId();
    }
  },

  willDestroy() {
    this._super(...arguments);

    get(this, 'userLocation').off('userLocationChanged');
  },

  defaultDataLayerAttrs: computed('locationId', 'clientId', 'session.currentUser.userId', function() {
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
          get(this, 'logger').log("[dataLayer Event]: ", trackData.event, trackData);
        }
      });
    }
  },

  trackVirtualPageview(url) {
    const currentUser          = get(this, 'session.currentUser');
    const currentUserID        = (currentUser) ? get(currentUser, 'userId') : 'anonymous';
    const currentUserCommunity = (currentUser) ? get(currentUser, 'location') : 'none';

    const currentUrl = window.location.href;
    const currentOrgName = get(this,'currentController.currentController.model.organizationName') || null;

    this.push({
      'event'                   : 'VirtualPageview',
      'virtualPageURL'          : url,
      'virtualPageTitle'        : document.title,
      'virtualUserID'           : currentUserID,
      'virtualCommunity'        : currentUserCommunity,
      'VirtualPageReferrer'     : currentUrl,
      'virtualOrganizationName' : currentOrgName
    });
  },

  chooseDifferentLocation(locationId, locationName) {
    this.push({
      event: "ChooseLocation",
      new_location_id: locationId,
      new_location_name: locationName
    });
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
          get(this, 'logger').info(`[Impression of content]: ${content_id}`);
        }
      });
    }
  },

  promoLoad(promo, opts = {}) {
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

        get(this, 'api').recordPromoBannerLoad(id, trackData);

        if (get(this, 'logEnabled')) {
          get(this, 'logger').info(`[Load of banner]: ${get(promo, 'id')}, [GTM blocked]: ${gtmBlocked}`);
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
          get(this, 'logger').info(`[Impression of banner]: ${get(promo, 'id')}, [GTM blocked]: ${gtmBlocked}`);
        }
      });
    }
  },

  profileImpression(organization) {
    if(!get(this, 'fastboot.isFastBoot')) {
      this.waitForLocationAndClientId().then((data) => {
        const trackData = {
          client_id: data.clientId,
          // In some tests, location will be undefined
          location_id: get(data, 'location.id'),
          event_type: 'impression'
        };

        get(this, 'api').recordProfileEvent(get(organization, 'id'), trackData);
      });
    }
  },

  profileContentClick(organization, content) {
    if(!get(this, 'fastboot.isFastBoot')) {
      this.waitForLocationAndClientId().then((data) => {
        const trackData = {
          client_id: data.clientId,
          content_id: get(content, 'contentId'),
          // In some tests, location will be undefined
          location_id: get(data, 'location.id'),
          event_type: 'click'
        };

        get(this, 'api').recordProfileEvent(get(organization, 'id'), trackData);
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
            location_id: get(data, 'location.id'),
          }, opts);

        get(this, 'api').recordPromoBannerClick(id, trackData);

        if(get(this, 'logEnabled')) {
          get(this, 'logger').info(`[Click banner]: ${get(promo, 'id')}`);
        }
      });
    }

  },

  trackMarketReplyButtonClick() {
    this.push({
      event: 'event-reply-click'
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

  trackFeedChannelChange(filter) {
    this.push({
      event: 'ChangeFeedChannel',
      channel_choice: filter
    });
  },

  trackMetricsRequest(type, id) {
    const user_id = type === 'current-user' ? id : null;
    const organization_id = type === 'organization' ? id : null;

    this.push({
      event: 'MetricsReportButtonClicked',
      user_id,
      organization_id
    });
  },

  trackPaymentsRequest(type, id) {
    const user_id = type === 'current-user' ? id : null;
    const organization_id = type === 'organization' ? id : null;

    this.push({
      event: 'PaymentsReportButtonClicked',
      user_id,
      organization_id
    });
  },

  /** Commenting **/
  trackCommentSubmitButtonClick(button_disabled = false) {
    this.push({
      button_disabled,
      event: 'CommentSubmitButtonClicked'
    });
  },

  trackCommentSignInOrRegisterToPost() {
    this.push({
      event: 'CommentSignInOrRegisterToPost'
    });
  },

  trackCommentDeclinedToAuthenticate() {
    this.push({
      event: 'CommentDeclinedToAuthenticate'
    });
  },

  trackCommentSaved() {
    this.push({
      event: 'CommentSaved'
    });
  },

  trackUGCTooltipHide() {
    this.push({
      event: 'UGCJobsTooltipHide'
    });
  },

  trackCarouselEvent(eventName, carouselId, carouselType) {
    this.push({
      event: `Carousel${eventName}`,
      carousel_id: carouselId,
      carousel_type: carouselType,
      url: window.location.href
    });
  },

  trackCarouselCardClickEvent(elementName, carouselId, contentId) {
    this.push({
      event: `CarouselClickedCard`,
      content_id: contentId,
      element: elementName,
      carousel_id: carouselId,
      url: window.location.href
    });
  },

  trackDetailEngagementEvent(contentId, detailType, startOrComplete, contentType, whichFeed) {
    this.push({
      event: `DetailEngagement-${startOrComplete}`,
      content_id: contentId,
      content_type: contentType,
      detail_type: detailType,
      detail_location: whichFeed,
      url: window.location.href
    });
  },

  trackBookmarkEvent(bookmarkAction, contentId, whichFeed) {
    this.push({
      event: `BookmarkEvent`,
      event_action: bookmarkAction,
      content_id: contentId,
      event_location: whichFeed,
      url: window.location.href
    });
  },

  trackAppDownloadNagEvent(appDownloadNagAction) {
    this.push({
      event: `AppDownloadNagEvent`,
      event_action: appDownloadNagAction
    });
  },


  trackTileLoad(content) {
    this._checkIfCanEditContent(content).then(canEditContent => {
      if (!canEditContent) {
        this.push({
          event: 'VirtualTileLoad',
          content_type: get(content, 'contentType'),
          content_id: get(content, 'contentId'),
          organization_id: get(content, 'organizationId')
        });
      }
    });
  },

  trackTileImpression(options) {
    const content = options.model;

    this._checkIfCanEditContent(content).then(canEditContent => {
      if (!canEditContent) {
        this.push({
          event: 'VirtualTileImpression',
          content_type: get(content, 'contentType'),
          content_id: get(content, 'contentId'),
          organization_id: get(content, 'organizationId'),
          impression_location: options.impressionLocation
        });
      }
    });
  },

  trackHideAuthor(hideObject) {
    this.push({
      event: 'UserHidesAuthor',
      content_id: hideObject.contentId || 'From Profile',
      organization_id: hideObject.organizationId,
      organization_name: hideObject.organizationName,
      flag_type: hideObject.flagType
    });
  },

  trackUnhideAuthor(hideObject) {
    this.push({
      event: 'UserUnhidesAuthor',
      organization_id: hideObject.organizationId,
      organization_name: hideObject.organizationName
    });
  },

  trackHideLocation(hideObject) {
    this.push({
      event: 'UserHidesLocation',
      content_id: hideObject.contentId,
      location_id: hideObject.locationId,
      location_name: hideObject.locationName,
      flag_type: hideObject.flagType
    });
  },

  trackTileOptionsMenuEvent(eventName, content_id) {
    this.push({
      event: 'TileOptionsMenuEvent',
      event_action: eventName,
      content_id
    });
  },

  /** Private **/

  _checkIfCanEditContent(content) {
    if (get(this, 'session.isAuthenticated')) {
      return get(this, 'currentUser').then(currentUser => {
        const authorId = get(content, 'authorId');
        const organizationId = get(content, 'organizationId') || null;

        return currentUser.canEditContent(authorId, organizationId);
      });
    }

    return RSVP.Promise.resolve(false);
  },

  _eventuallyGetClientId() {
    run.cancel(this._gaDelayedCapture);

    let clientId = get(this, 'clientId');
    const deferred = get(this, '_clientIdDeferred');
//NOTE: Need to figure out how to know if in testing mode
var isTesting = false;
    if (isTesting) {
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
            get(this, 'logger').log('No client id availble from GA yet');
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
        get(this, 'logger').log('Client ID from GA:', clientId);
      }
    }

    return clientId;
  }

});
