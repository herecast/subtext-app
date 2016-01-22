import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import ajax from 'ic-ajax';
import TrackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Component.extend(TrackEvent, {
  promotionService: Ember.inject.service('promotion'),

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
      const url = `${config.API_NAMESPACE}/promotion_banners/${bannerId}/track_click`;

      ajax(url, {
        type: 'POST',
        data: {
          content_id: this.get('contentModel.contentId')
        }
      });
    }
  }
});
