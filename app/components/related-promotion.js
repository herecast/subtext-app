import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  promotionService: Ember.inject.service('promotion'),

  getPromotion: function() {
    const contentId = this.get('contentId');

    if (contentId) {
      this.get('promotionService').find(contentId).then((promotion) => {
        this.set('promotion', promotion);
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
          content_id: this.get('contentId')
        }
      });
    }
  }
});
