import Component from '@ember/component';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'PromotionCoupon',
  api: service(),

  coupon: null,

  clickedFullsize: false,
  displayFullsize: false,

  recordEvent(type, content) {
    get(this, 'api').recordAdMetricEvent({
      ad_metric: {
        campaign: 'promotion_coupon',
        promotion_banner_id: get(this, 'coupon.id'),
        content: content,
        event_type: type,
        page_url: window.location.href
      }
    });
  },

  actions: {
    toggleDisplayFullsize() {
      this.toggleProperty('displayFullsize');

      if (!get(this, 'clickedFullsize')) {
        this.recordEvent('click', 'Clicked See Fullsize');
        set(this, 'clickedFullsize', true);
      }
    }

  }
});
