import Ember from 'ember';
import validateFormat from 'ember-validators/format';

/* global dataLayer */

const {
  inject,
  get,
  set,
  isEmpty,
  RSVP: {Promise}
} = Ember;

export default Ember.Component.extend({
  tagName: 'form',
  api: inject.service(),

  error: null,
  didComplete: false,
  noAccount: false,

  email: null,
  onEmailSubmit: null,
  onJoinClick: null,

  submit(e) {
    e.preventDefault();
    this.send('sendEmail');
  },

  validate() {
    set(this, 'error', null);
    set(this, 'noAccount', false);

    if (get(this, '_hasSubmitted')) {
      const email = get(this, 'email');

      if (isEmpty(email)) {
        set(this, 'error', 'cannot be blank');
        return false;
      }

      const isValid = validateFormat(email, {
        allowBlank: false,
        type: 'email'
      });

      if (isValid !== true) {
        set(this, 'error', 'must be a valid email address');
        return false;
      }
    }

    return true;
  },

  trackSignInClick() {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'sign-in-submit-click',
        sign_in_type: 'magic'
      });
    }
  },

  actions: {
    validate() {
      this.validate();
      return true;
    },

    sendEmail() {
      set(this, '_hasSubmitted', true);
      if (this.validate()) {
        const email = get(this, 'email');

        this.trackSignInClick();

        return get(this, 'api').sendEmailSignInLink(email).then(
          () => {
            const onEmailSubmit = get(this, 'onEmailSubmit');
            if (onEmailSubmit) {
              this.onEmailSubmit(email);
            }
          },
          (e) => {
            if (e.errors && e.errors[0]) {
              if (e.errors[0].status === "422") {
                set(this, 'noAccount', true);
                return;
              }
            }

            set(this, 'error', "An unknown error occurred. Please contact support.");
            console.error(e);
          }
        );
      } else {
        return Promise.resolve();
      }
    }
  }
});
