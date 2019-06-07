import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import EmberObject, {
  observer,
  computed,
  setProperties,
  set,
  get
} from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  tracking: service(),
  ads: service(),
  currentService: service('currentController'),
  promotion: null,
  pagePositionForAnalytics: null,
  placeholderClass: null,
  adContextName: reads('currentService.currentPath'),
  lastRefreshDate: null,

  _didSendImpression: false,
  _isInViewPort: false,
  _imageIsLoaded: false,
  _renderedTime: null,
  _loadedTime: null,

  init() {
    this._super(...arguments);
    this._cachedRefreshDate = get(this, 'lastRefreshDate') || null;
    this._viewportOptionsOverride();
  },

  /**
   * RULES for sending an impression
   *
   * Must be in viewport.
   * Image must be downloaded and visible.
   * Must not have already been sent
   */
  _canSendImpression: computed('_didSendImpression', '_isVisible', function() {
    const didSendImpression = get(this, '_didSendImpression');
    const isVisible = get(this, '_isVisible');

    return !didSendImpression && isVisible;
  }),

  _isVisible: computed('_isInViewPort', '_imageIsLoaded', function() {
    return get(this, '_isInViewPort') && get(this, '_imageIsLoaded');
  }),

  /**
   * Path changed, so if it was on a background page, which is now the
   * focused page, recheck the conditions.
   */
  pathDidChange: observer('currentService.currentPath', function() {
    const impressionPath = get(this, 'impressionPath');

    if(isPresent(impressionPath)) {
      run.next(()=>{
        if(!get(this, 'isDestroying')) {
          this.trySendImpression();
        }
      });
    }
  }),

  _pushEvent(event) {
    const promo = get(this, 'promotion');

    get(this, 'tracking').push({
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

  _sendImpression() {
    const promo = get(this, 'promotion');
    if (! get(this, 'isDestroyed') && promo) {
      const contentId = get(this, 'contentModel.contentId') || get(this, 'contentModel.id');

      get(this, 'tracking').promoImpression(promo, {
        content_id: contentId,
        page_url: get(this, 'currentService.currentUrl'),
        page_placement: get(this, 'pagePositionForAnalytics')
      });

      this._pushEvent('VirtualAdImpresion');
    }
  },

  _getPromotion() {
    const adContextName = get(this, 'adContextName');
    const content = get(this, 'contentModel');
    const ads = get(this, 'ads');
    const promotionId = get(this, 'overrideId');

    let contentId;

    if (content) {
      contentId = get(content, 'contentId');
    }

    set(this, '_imageIsLoaded', false);

    return ads.getAd(adContextName, {contentId, promotionId}).then(promotion => {
      if (!get(this, 'isDestroyed')) {
        this.setProperties({
          promotion: EmberObject.create(promotion),
          _didSendImpression: false
        });

        this._pushEvent('VirtualAdLoaded');
      }
    });
  },

  /**
   * Check if an impression can be sent based on conditional,
   * then queue up a timer to ensure ad is visible for the required
   * length of time.
   */
  trySendImpression() {
    run.cancel(get(this, '_pendingImpression'));
    // In runloop to ensure any property changes have finished
    // before checking if we can send the impression.
    run.next(()=>{
      if(!get(this, 'isDestroying')) {
        if(get(this, '_canSendImpression')) {
          this._timeImpressionThenSend();
        }
      }
    });
  },

  // Industry standard is to make sure ad is visible for at least 1 second.
  //
  // Set timeout for 1 second, then ensure ad still visible before sending
  // impression.
  _timeImpressionThenSend() {
    set(this, '_pendingImpression', run.later(this, ()=>{
      if(!get(this, 'isDestroying')) {
        // Check to make sure we are still good to record impression
        // (not left viewport, or loaded new banner, etc...)
        if(get(this, '_canSendImpression')) {
          this._sendImpression();

          set(this, '_didSendImpression', true);
        }
      }
    }, 1000));
  },

  /**
   * When ad scrolls into view, queue up an impression
   */
  didEnterViewport() {
    set(this, '_isInViewPort', true);
    this.trySendImpression();
  },

  didExitViewport() {
    if (!get(this, 'isDestroyed')) {
      set(this, '_isInViewPort', false);
    }
  },

  didUpdateAttrs() {
    // Reload the promotion if the last refresh date has changed
    if (get(this, 'lastRefreshDate') && this._cachedRefreshDate !== get(this, 'lastRefreshDate')) {
      this._getPromotion();
      this._cachedRefreshDate = get(this, 'lastRefreshDate');
    }

    this._super(...arguments);
  },

  didInsertElement() {
    // Note: it is considered safe to allow the ad-banner to render in fastboot since it never fires `didInsertElement`.
    // Thus, no ad impression should be triggered incorrectly.
    this._super(...arguments);
    set(this, '_renderedTime', (new Date()));

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

      get(this, 'tracking').promoBannerClick(promo, {
        page_url: get(this, 'currentService.currentUrl'),
        page_placement: get(this, 'pagePositionForAnalytics'),
        content_id: (contentId) ? contentId : null
      });

      this._pushEvent('VirtualAdClicked');
    }
  },

  trackLoad() {
    const promo = get(this, 'promotion');
    const contentId = get(this, 'contentModel.contentId');
    const renderedTime = get(this, '_renderedTime');
    const imageLoadedTime = get(this, '_imageLoadedTime');
    const loadTime = (
      imageLoadedTime.getTime() - renderedTime.getTime()
    ) / 1000;

    get(this, 'tracking').promoLoad(promo, {
      load_time: loadTime,
      page_url: get(this, 'currentService.currentUrl'),
      page_placement: get(this, 'pagePositionForAnalytics'),
      select_score: get(promo, 'select_score'),
      select_method: get(promo, 'select_method'),
      content_id: (contentId) ? contentId : null
    });
  },

  actions: {
    /**
     * We need to wait until the image is actually downloaded and visible
     * before queing up an impression.
     */
    imageFinishedLoading() {
      set(this, '_imageLoadedTime', (new Date()));
      set(this, '_imageIsLoaded', true);

      this.trackLoad();
      this.trySendImpression();
    }
  }
});
