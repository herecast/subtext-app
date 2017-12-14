import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';
import Validation from 'subtext-ui/mixins/components/validation';

const {
  computed,
  get,
  set,
  isEmpty,
  isPresent,
  RSVP: {Promise},
  inject
} = Ember;

export default Ember.Component.extend(TestSelector, Validation, {
  tagName: "form",
  tracking: inject.service(),
  api: inject.service(),
  session: inject.service(),
  notify: inject.service('notification-messages'),
  _routing: inject.service('-routing'),
  userLocation: inject.service(),
  logger: inject.service(),

  userMustConfirm: false,

  tab: 'sign-in-with-password',
  isSignIn: computed.equal('tab', 'sign-in-with-password'),
  isRegister: computed.equal('tab', 'register'),

  hasError: computed('userMustConfirm', 'error', function() {
    return get(this, 'userMustConfirm') || !isEmpty(get(this, 'error'));
  }),

  defaultName: computed('email', function() {
    const email = get(this, 'email');
    if (isPresent(email)) {
      let emailParts = email.split('@');
      return emailParts[0];
    } else {
      return null;
    }
  }),

  submit() {
    if (get(this, 'isSignIn')) {
      return this.authenticate();
    } else {
      return this.registerUser();
    }
  },

  trackSignInClick() {
    get(this, 'tracking').push({
      event: 'sign-in-submit-click',
      sign_in_type: 'password'
    });
  },

  authenticate() {
    this.trackSignInClick();

    return new Promise((resolve, reject) => {
      if (this.isValid()) {
        let {email, password} =  this.getProperties('email', 'password');
        get(this, 'session').authenticate('authenticator:application', email, password).then(
          () => {
            const afterAuthenticate = get(this, 'afterAuthenticate');
            if (afterAuthenticate) {
              afterAuthenticate();
            }
            get(this, 'notify').notifyLoginSuccess();
            resolve();
          },
          (response) => {
            if ('error' in response) {
              // resend confirmation email
              if (response.error.indexOf('confirm') !== -1) {
                set(this, 'userMustConfirm', true);
              } else {
                get(this, 'notify').error(response.error);
              }
            } else {
              get(this, 'notify').error('Error: Unable to sign in.');
            }

            reject();
          });
      } else {
        get(this, 'notify').error('Error: All fields must be valid');
        reject();
      }
    });
  },

  registerUser() {
    const api = get(this, 'api');
    const password = this.get('password');
    const email = this.get('email');
    const notify = this.get('notify');

    return new Promise((resolve, reject) => {
      if (this.isValid()) {
        const registerUser = (locationId) => {
          api.createRegistration({
            user: {
              name: get(this, 'defaultName'),
              email,
              password,
              password_confirmation: password,
              location_id: locationId,
              location_confirmed: get(this, 'userLocation.locationIsConfirmed')
            }
          }).then(
            (response) => {
              const onRegistration = get(this, 'onRegistration');
              if (onRegistration) {
                onRegistration(response);
              } else {
                return get(this, '_routing').transitionTo('register.complete');
              }
              const afterAuthenticate = get(this, 'afterAuthenticate');
              if (afterAuthenticate) {
                afterAuthenticate();
              }
              resolve();
            },
            (response) => {
              get(this, 'logger').error(response);

              if('errors' in response) {
                if('email' in response.errors &&
                  response.errors['email'].includes("has already been taken")) {
                  notify.error("An account already exists with that email. Try signing in instead.");
                } else {
                  notify.error("An unknown error has occurred. Please contact support.");
                }
              }

              reject();
            });
        };

        // Register the user after we load the location
        // If location does not load, register user with default location
        get(this, 'userLocation.location').then(location => {
          registerUser(get(location, 'id'));
        }).catch((e) => {
          get(this, 'logger').error(e);
          registerUser('hartford-vt');
        });
      } else {
        resolve();
      }
    });
  },

  validateForm() {
    const password = get(this, 'password');
    const email = get(this, 'email');

    this.hasValidPassword(password);
    this.validatesEmailFormatOf(email);
  },

  focusOnEmail() {
    // Do not auto focus on fields on mobile. It creates a confusing user experience when the keyboard pops up.
    if (!get(this, 'media.isMobile')) {
      this.$().find('#SignInForm-email').focus();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.focusOnEmail();
  },

  actions: {
    changeMode(tab) {
      set(this, 'tab', tab);
      this.focusOnEmail();
    },

    authenticate() {
      return this.authenticate();
    },

    registerUser() {
      return this.registerUser();
    },

    clearErrors() {
      set(this, 'userMustConfirm', false);
      set(this, 'error', null);
    },

    reconfirm() {
      const id = get(this, 'email');
      get(this, '_routing').transitionTo('register.reconfirm', null, {
        email: id
      });
    }
  },

  forgotPassword() {
    get(this, '_routing').transitionTo('forgot-password');
    const afterAuthenticate = get(this, 'afterAuthenticate');
    afterAuthenticate();
  }

});
