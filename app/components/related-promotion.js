import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  promotionService: Ember.inject.service('promotion'),
  mixpanel: Ember.inject.service('mixpanel'),

  getPromotion: function() {
    const content = this.get('contentModel');

    if (content) {
      const contentId = content.get('contentId');
      this.get('promotionService').find(contentId).then((promotion) => {
        this.set('promotion', promotion);
        const props = {};
        const mixpanel = this.get('mixpanel');
        const currentUser = this.get('session.currentUser');
        Ember.merge(props, mixpanel.getUserProperties(currentUser));
        Ember.merge(props, mixpanel.getContentProperties(content));
        Ember.merge(props, {
          bannerAdId: promotion.banner_id,
          bannerUrl: promotion.redirect_url,
          url: window.location.href
        });
        this.get('mixpanel').trackEvent('displayBannerAd', props);
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
