/* global dataLayer */

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
  promotionService: inject.service('promotion'),

  currentService: inject.service('currentController'),

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
        if(get(this, '_currentPathMatchesImpressionPath')) {
          // trigger enter view port event
          this.resetViewportEntered();
        }
      });
    }
  }),

  lastRefreshDate: null,

  _didSendImpression: false,

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
    if (! get(this, 'isDestroyed')) {
      set(this, '_didSendImpression', true);

      console.info(`Impression of promotion: ${get(this, 'promotion.promotion_id')}`);

      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event'         : 'VirtualAdImpresion',
          'advertiser'    : get(this, 'promotion.organization_name'),
          'promotion_id'  : get(this, 'promotion.promotion_id'),
          'banner_id'     : get(this, 'promotion.banner_id'),
          'redirect_url'  : get(this, 'promotion.redirect_url')
        });
      }
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

  resetViewportEntered() {
    set(this, 'viewportEntered', false);
    this._setViewportEntered(window);
  },

  _getPromotion() {
    const content = get(this, 'contentModel');
    let contentId;

    if (content) {
      contentId = get(content, 'id');
    }

    return get(this, 'promotionService').find(contentId).then(promotion => {
      if (!get(this, 'isDestroyed')) {
        this.setProperties({
          promotion: promotion,
          _didSendImpression: false
        });

        if (typeof dataLayer !== "undefined") {
          dataLayer.push({
            'event'         : 'VirtualAdLoaded',
            'advertiser'    : promotion.organization_name,
            'promotion_id'  : promotion.promotion_id,
            'banner_id'     : promotion.banner_id,
            'redirect_url'  : promotion.redirect_url
          });
        }
      }
    });
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
          'redirect_url' : get(this, 'promotion.redirect_url')
        });
      }
    }
  }
});
