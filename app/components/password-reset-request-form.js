import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, set, inject, isPresent } = Ember;

export default Ember.Component.extend(Validation, TestSelector, {
  tagName: 'form',

  api: inject.service(),

  showConfirmation: false,
  returnUrl: null,
  error: null,

  actions: {
    submit() {
      const api = get(this, 'api');
      const email = get(this, 'email');
      const returnUrl = get(this, 'returnUrl');

      if (isPresent(email) && this.hasValidEmail(email)) {
        set(this, 'error', null);
        api.requestPasswordReset(email, returnUrl).then(() => {
          if('afterReset' in this.attrs) {
            this.attrs.afterReset();
          } else {
            this.set('showConfirmation', true);
          }
        }, () => {
          set(this, 'error', 'Email address not found.');
        });
      } else {
        set(this, 'error', 'Valid email is required.');
      }
    }
  }
});
