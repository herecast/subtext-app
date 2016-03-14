import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  get,
  inject
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  promotionService: Ember.inject.service('promotion'),
  api: inject.service('api'),
  getPromotion: function() {
    const content = this.get('contentModel');

    if (content) {
      const contentId = content.get('contentId');
      this.get('promotionService').find(contentId).then((promotion) => {
        this.set('promotion', promotion);

        this.trackEvent('displayBannerAd', {
          bannerAdId: promotion.banner_id,
          bannerUrl: promotion.redirect_url,
        });
      });
    }
  }.on('didInsertElement'),

  click() {
    // Some banners may not have a redirect URL, so we only want to track the
    // clicks for ones that do.
    if (this.get('promotion.redirect_url')) {
      const bannerId = this.get('promotion.banner_id');
      const api = get(this, 'api');

      this.trackEvent('clickBannerAd', {
        bannerAdId: get(this, 'promotion.banner_id'),
        bannerUrl: get(this, 'promotion.redirect_url')
      });

      api.recordPromoBannerClick(bannerId, {
        content_id: this.get('contentModel.contentId')
      });
    }
  }
});
