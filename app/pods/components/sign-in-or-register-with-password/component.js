import { inject as service } from '@ember/service';
import { equal, and, gt, readOnly } from '@ember/object/computed';
import { set, get, computed } from '@ember/object';
import { isPresent, isEmpty } from '@ember/utils';
import { Promise } from 'rsvp';
import TestSelector from 'subtext-app/mixins/components/test-selector';
import Validation from 'subtext-app/mixins/components/validation';
import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend(TestSelector, Validation, {
  tagName: "form",
  'data-test-sign-in-or-register-with-password-tab': readOnly('tab'),

  tracking: service(),
  api: service(),
  session: service(),
  notify: service('notification-messages'),
  router: service(),
  userLocation: service(),
  logger: service(),
  media: service(),

  userMustConfirm: false,

  newHandle: null,
  newHandleIsUnique: false,
  hasCheckedHandle: false,

  newEmail: null,
  newEmailIsUnique: false,
  hasCheckedEmail: false,

  password: null,
  passwordConfirmation: null,

  tab: 'sign-in-with-password',
  isSignIn: equal('tab', 'sign-in-with-password'),
  isRegister: equal('tab', 'register'),

  hasError: computed('userMustConfirm', 'error', function() {
    return get(this, 'userMustConfirm') || !isEmpty(get(this, 'error'));
  }),

  passwordDisabled: computed('newHandleIsUnique', 'newEmailIsUnique', function() {
    return !(get(this, 'newHandleIsUnique') && get(this, 'newEmailIsUnique'));
  }),

  canRegister: and('newHandleIsUnique', 'newEmailIsUnique', 'passwordIsOk', 'passwordConfirmationIsOk'),

  hasPassword: gt('password.length', 2),

  passwordIsOk: computed('password', function() {
    return this.hasValidPassword(get(this, 'password'));
  }),

  passwordConfirmationIsOk: computed('password', 'passwordConfirmation', function() {
    return get(this, 'passwordIsOk') && get(this, 'password') === get(this, 'passwordConfirmation');
  }),

  showPasswordBlock: computed('newHandleIsUnique', 'newEmailIsUnique', 'hasCheckedEmail', function() {
    return get(this, 'hasCheckedEmail') || (get(this, 'newHandleIsUnique') && get(this, 'newEmailIsUnique'));
  }),

  defaultName: computed('email', function() {
    const email = get(this, 'email') || get(this, 'newEmail');
    if (isPresent(email)) {
      let emailParts = email.split('@');
      return emailParts[0];
    } else {
      return null;
    }
  }),

  trackSignInClick() {
    get(this, 'tracking').push({
      event: 'sign-in-submit-click',
      sign_in_type: 'password'
    });
  },

  trackRegisterUser(handle) {
    get(this, 'tracking').push({
      event: 'NewUserRegistered',
      handle
    });
  },

  authenticate() {
    this.trackSignInClick();

    return new Promise((resolve, reject) => {
      if (this.isValid()) {
        let {email, password} =  this.getProperties('email', 'password');
        get(this, 'session').authenticate('authenticator:application', email, password)
        .then(() => {
          if (get(this, 'afterAuthenticate')) {
            get(this, 'afterAuthenticate')();
          }

          get(this, 'notify').notifyLoginSuccess();

          resolve();
        })
        .catch((response) => {
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
    const password = get(this, 'password');
    const passwordConfirmation = get(this, 'passwordConfirmation');
    const newHandle = get(this, 'newHandle');
    const newEmail = get(this, 'newEmail');
    const notify = this.get('notify');

    return new Promise((resolve, reject) => {
      if (get(this, 'canRegister')) {
        const registerUser = (locationId) => {
          api.createRegistration({
            user: {
              handle: newHandle,
              email: newEmail,
              name: get(this, 'defaultName'),
              password,
              password_confirmation: passwordConfirmation,
              location_id: locationId
            },
            instant_signup: true
          })
          .then(emailAndToken => {
            this.trackRegisterUser(newHandle);
            
            return get(this, 'session').authenticate('authenticator:restore', emailAndToken)
            .then(() => {
              if (get(this, 'afterAuthenticate')) {
                get(this, 'afterAuthenticate')();
              }
              this._goToSettings();
              resolve();
            });
          })
          .catch(error => {
            get(this, 'logger').error(error);

            if ('errors' in error) {
              if (error.errors && 'email' in error.errors &&
                error.errors['email'].includes("has already been taken")) {
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
        get(this, 'userLocation.userLocation')
        .then(location => {
          registerUser(get(location, 'id'));
        })
        .catch((e) => {
          get(this, 'logger').error(e);
          registerUser(null);
        });
      } else {
        resolve();
      }
    });
  },

  _goToSettings() {
    get(this, 'session.currentUser')
    .then(() => {
      get(this, 'session').setupCasterIntroModal();
      get(this, 'router').transitionTo('settings');
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
      $(this.element).find('#SignInForm-email').focus();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.focusOnEmail();
  },

  actions: {
    changeMode(tab) {
      set(this, 'tab', tab);
      if (!get(this, 'isRegister')) {
        this.focusOnEmail();
      }

      if (get(this, 'changeModule')) {
        get(this, 'changeModule')(tab);
      }
    },

    afterAuthenticate() {
      if (get(this, 'afterAuthenticate')) {
        get(this, 'afterAuthenticate')();
      }
    },

    signIn() {
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
      get(this, 'router').transitionTo('register.reconfirm', null, {
        email: id
      });
    },

    goToSettings() {
      this._goToSettings();
    },

    protectReturn(e) {
      if (event.keyCode === 13) {
        e.preventDefault();
        if (get(this, 'isSignIn')) {
          this.authenticate();
        }
        return false;
      }
    }
  },

  forgotPassword() {
    get(this, 'router').transitionTo('forgot-password');
    const afterAuthenticate = get(this, 'afterAuthenticate');
    afterAuthenticate();
  }
});
