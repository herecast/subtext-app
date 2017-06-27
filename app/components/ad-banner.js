import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  get,
  set,
  run,
  inject,
  isPresent,
  setProperties,
  computed,
  observer
} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  api: inject.service(),
  ads: inject.service(),
  session: inject.service(),
  currentService: inject.service('currentController'),
  promotion: null,
  impressionPath: null,
  pagePositionForAnalytics: null,
  placeholderClass: null,

  adContextName: computed.reads('currentService.currentPath'),

  _canSendImpression: computed('impressionPath', '_didSendImpression',
    '_currentPathMatchesImpressionPath', function() {
    const impressionPath = get(this, 'impressionPath');
    const didSendImpression = get(this, '_didSendImpression');

    if(isPresent(impressionPath)) {
      return !didSendImpression && get(this, '_currentPathMatchesImpressionPath');
    } else {
      return !didSendImpression;
    }
  }),

  _currentPathMatchesImpressionPath: computed('impressionPath', 'currentService.currentPath', function() {
    const impressionPath = get(this, 'impressionPath');
    const currentPath = get(this, 'currentService.currentPath');

    return currentPath === impressionPath;
  }),

  pathDidChange: observer('currentService.currentPath', function() {
    const impressionPath = get(this, 'impressionPath');

    if(isPresent(impressionPath)) {
      run.next(()=>{
        if(!get(this, 'isDestroying')) {
          if(get(this, '_currentPathMatchesImpressionPath')) {
            // trigger enter view port event
            this.resetViewportEntered();
          }
        }
      });
    }
  }),

  lastRefreshDate: null,

  _didSendImpression: false,

  _pushEvent(event) {
    const promo = get(this, 'promotion');

    this.tracking.push({
      'event'           : event,
      'advertiser'      : get(promo, 'organization_name'),
      'promotion_id'    : get(promo, 'promotion_id'),
      'banner_id'       : get(promo, 'id'),
      'redirect_url'    : get(promo, 'redirect_url'),
      'promotion_title' : get(promo, 'title')
    });

  },

  _viewportOptionsOverride() {
    // ensures the ad is at least 50% visible
    // before it is considered visible
    setProperties(this, {
      viewportUseRAF   : true,
      viewportSpy      : true,
      viewportTolerance: {
        top    : 150, // half the ad height
        bottom : 150, // half the ad height
        left   : 20,
        right  : 20
      }
    });
  },

  _validateGTM() {
    return typeof window.google_tag_manager === 'undefined';
  },

  _sendImpression() {
    const promo = get(this, 'promotion');
    if (! get(this, 'isDestroyed') && promo) {
      const contentId = get(this, 'contentModel.id');
      const api = get(this, 'api');
      const metrics_id = get(promo, 'metrics_id') || get(promo, 'id');
      const clientId = get(this, 'session').getClientId();

      api.recordPromoBannerImpression(metrics_id, {
        content_id: contentId,
        client_id: clientId,
        gtm_blocked: this._validateGTM(),
        page_url: get(this, 'currentService.currentUrl'),
        page_placement: get(this, 'pagePositionForAnalytics')
      });

      console.info(`[Impression of banner]: ${get(promo, 'id')}, [GTM blocked]: ${this._validateGTM()}`);

      this._pushEvent('VirtualAdImpresion');

      set(this, '_didSendImpression', true);
    }
  },

  _getPromotion() {
    const adContextName = get(this, 'adContextName');
    const content = get(this, 'contentModel');
    const ads = get(this, 'ads');
    const clientId = get(this, 'session').getClientId();
    const promotionId = get(this, 'overrideId');

    let contentId;

    if (content) {
      contentId = get(content, 'contentId');
    }

    return ads.getAd(adContextName, {contentId, clientId, promotionId}).then(promotion => {
      if (!get(this, 'isDestroyed')) {
        this.setProperties({
          promotion: Ember.Object.create(promotion),
          _didSendImpression: false
        });

        console.info(`[Loaded banner]: ${promotion.id}`);

        this._pushEvent('VirtualAdLoaded');
      }
    });
  },

  didEnterViewport() {
    if (get(this, '_canSendImpression')) {
      set(this, '_pendingImpression', run.later(this, this._sendImpression, 1000));
    }
  },

  didExitViewport() {
    run.cancel(get(this, '_pendingImpression'));
  },

  resetViewportEntered() {
    set(this, 'viewportEntered', false);
    this._setViewportEntered(window);
  },


  didUpdateAttrs({ newAttrs }) {
    // Reload the promotion if the last refresh date has changed
    if ('lastRefreshDate' in newAttrs && newAttrs.lastRefreshDate !== get(this, 'lastRefreshDate')) {
      this._getPromotion().then(()=>{
        this.resetViewportEntered();
      });
    }

    this._super(...arguments);
  },

  didInsertElement() {
    // Note: it is considered safe to allow the ad-banner to render in fastboot since it never fires `didInsertElement`.
    // Thus, no ad impression should be triggered incorrectly.
    this._super();
    this._viewportOptionsOverride();

    const promotion = get(this, 'promotion');
    if (isPresent(promotion)) {
      if ('then' in promotion) {
        promotion.then(() => {
          this._pushEvent('VirtualAdLoaded');
        });
      } else {
        this._pushEvent('VirtualAdLoaded');
      }
    } else {
      this._getPromotion();
    }
  },

  click() {
    // Some banners may not have a redirect URL, so we only want to track the
    // clicks for ones that do.
    if (get(this, 'promotion.redirect_url')) {
      const contentId = get(this, 'contentModel.contentId');
      const promo = get(this, 'promotion');
      const api = get(this, 'api');
      const metrics_id = get(promo, 'metrics_id') || get(promo, 'id');
      const clientId = get(this, 'session').getClientId();

      api.recordPromoBannerClick(metrics_id, {
        content_id: (contentId) ? contentId : null,
        client_id: clientId
      });

      console.info(`[Click banner]: ${get(promo, 'id')}`);

      this._pushEvent('VirtualAdClicked');
    }
  }
});
