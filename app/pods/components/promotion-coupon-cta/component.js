import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {computed, set, get, isEmpty, inject:{service}} = Ember;

export default Ember.Component.extend(Validation, {
  classNames: 'PromotionCouponCta',
  classNameBindings: ['wantsEmail:open'],

  api: service(),

  coupon: null,
  wantsEmail: false,

  isRequesting: false,
  hasRequested: false,
  hasClicked: false,

  currentUser: computed.alias('session.currentUser'),

  init() {
    this._super(...arguments);
    let email = get(this, 'currentUser.email');
    if (!isEmpty(email)) {
      set(this, 'coupon.email', email);
    }
  },

  validateForm() {
    const email = get(this, 'coupon.email');
    if (isEmpty(email) || !this.hasValidEmail(email)) {
      set(this, 'errors.email', 'Valid email is required');
    } else {
      set(this, 'errors.email', null);
      delete get(this, 'errors')['email'];
    }
  },

  recordEvent(type, content) {
    get(this, 'api').recordAdMetricEvent({
      ad_metric: {
        campaign: 'promotion_coupon_cta',
        promotion_banner_id: get(this, 'coupon.id'),
        content: content,
        event_type: type,
        page_url: window.location.href
      }
    });
  },

  actions: {

    toggleWantsEmail() {
      this.toggleProperty('wantsEmail');

      if (!get(this, 'hasClicked')) {
        this.recordEvent('click', 'Clicked Wants Email Button');
        set(this, 'hasClicked', true);
      }
    },

    requestCoupon() {
      if (this.isValid()) {
        set(this, 'isRequesting', true);

        get(this, 'api').recordCouponRequest(get(this, 'coupon.id'), {
          email: get(this, 'coupon.email'),
          user_id: get(this,'currentUser.id')
        }).then(() => {
          set(this,'isRequesting', false);
          set(this, 'hasRequested', true);
        });
      }
    },

    validateEmail() {
      this.validateForm();
    }

  }

});
