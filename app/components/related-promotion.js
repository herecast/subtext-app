import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  click() {
    // Some banners may not have a redirect URL, so we only want to track the
    // clicks for ones that do.
    if (this.get('promotion.redirect_url')) {
      const bannerId = this.get('promotion.banner_id');

      ajax(`${config.API_NAMESPACE}/promotion_banners/${bannerId}/track_click`);
    }
  }
});
