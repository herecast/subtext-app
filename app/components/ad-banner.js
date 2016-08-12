import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
/* global dataLayer */

const {
  get,
  set,
  run,
  inject,
  setProperties
} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  api: inject.service(),
  promotionService: inject.service('promotion'),

  _canSendImpression: true,

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

  _sendImpression() {
    this.toggleProperty('_canSendImpression');

    if (typeof dataLayer !== "undefined") {
      dataLayer.push({
        'event'         : 'VirtualAdImpresion',
        'advertiser'    : get(this, 'promotion.organization_name'),
        'promotion_id'  : get(this, 'promotion.promotion_id'),
        'banner_id'     : get(this, 'promotion.banner_id'),
        'redirect_url'  : get(this, 'promotion.redirect_url')
      });
    }
  },

  didEnterViewport() {
    if (get(this, '_canSendImpression')) {
      set(this, '_pendingImpression', run.later(this, this._sendImpression, 1000));
    }
  },

  didExitViewport() {
    run.cancel(get(this, '_pendingImpression'));
  },

  _getPromotion() {
    const content = get(this, 'contentModel');
    let contentId;

    if (content) {
      contentId = get(content, 'contentId');
    }

    get(this, 'promotionService').find(contentId).then(promotion => {
      set(this, 'promotion', promotion);

      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event'         : 'VirtualAdLoaded',
          'advertiser'    : promotion.organization_name,
          'promotion_id'  : promotion.promotion_id,
          'banner_id'     : promotion.banner_id,
          'redirect_url'  : promotion.redirect_url,
        });
      }
    });
  },

  didInsertElement() {
    this._super();
    this._viewportOptionsOverride();
    this._getPromotion();
  },

  click() {
    // Some banners may not have a redirect URL, so we only want to track the
    // clicks for ones that do.
    if (get(this, 'promotion.redirect_url')) {
      const bannerId = get(this, 'promotion.banner_id');
      const api = get(this, 'api');
      const contentId = get(this, 'contentModel.contentId');

      api.recordPromoBannerClick(bannerId, {
        content_id: (contentId) ? contentId : null
      });

      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event'        : 'VirtualAdClicked',
          'advertiser'   : get(this, 'promotion.organization_name'),
          'promotion_id' : get(this, 'promotion.promotion_id'),
          'banner_id'    : get(this, 'promotion.banner_id'),
          'redirect_url' : get(this, 'promotion.redirect_url'),
        });
      }
    }
  }
});
