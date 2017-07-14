import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {get, set, isBlank} = Ember;

export default Ember.Component.extend(Validation, {
  classNames: 'BizFeed-AboutForm',
  
  business: null,

  validateForm() {
    this.validatePresenceOf('business.email');
    this.validateEmail();
  },

  validateEmail() {
    const email = get(this, 'business.email');
    if (isBlank(email) || !this.hasValidEmail(email)) {
      set(this, 'errors.email', 'Valid email is required');
    } else {
      set(this, 'errors.email', null);
      delete get(this, 'errors')['email'];
    }
  },

  actions: {
    validateEmail() {
      this.validateEmail();
    },

    submitForm() {
      if (this.isValid()) {
        this.sendAction('save');
      }
    }
  }
});
