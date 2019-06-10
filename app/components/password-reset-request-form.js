import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import Validation from 'subtext-app/mixins/components/validation';
import TestSelector from 'subtext-app/mixins/components/test-selector';

export default Component.extend(Validation, TestSelector, {
  tagName: 'form',

  api: service(),

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
          const afterReset = get(this, 'afterReset');
          if (afterReset) {
            afterReset();
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
