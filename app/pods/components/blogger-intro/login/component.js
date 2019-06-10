import { alias, notEmpty, readOnly, gte } from '@ember/object/computed';
import Component from '@ember/component';
import { setProperties, computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Validation from 'subtext-app/mixins/components/validation';

export default Component.extend(Validation, {
  session: service(),
  api: service(),
  notify: service('notification-messages'),

  currentUser: alias('session.currentUser'),
  hasCurrentUser: notEmpty('currentUser'),
  isBloggerAlready: readOnly('currentUser.isBlogger'),
  managedOrganizations: readOnly('currentUser.managedOrganizations'),

  checkingEmail: false,
  isLoggingIn: false,

  init() {
    this._super(...arguments);
    this._resetProperties();
  },

  _resetProperties() {
    setProperties(this, {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      emailHasBeenValid: false,
      alreadyHasAccount: false,
      needsNewAccount: false,
      passwordIsValid: false,
      hasAttemptedLogin: false,
      hasAttemptedPassword: false
    });
  },

  validateForm() {
    this.validatePresenceOf('name');
    this.validatesEmailFormatOf(get(this, 'email'));
  },

  formIsValid: computed('email', 'name', function() {
    return false;
  }),

  emailIsValid: computed('email', function() {
    const email = get(this, 'email');

    return this._validateEmail(email);
  }),

  _validateEmail(email) {
    const emailIsValid = this.hasValidEmail(email);

    if (emailIsValid && !get(this, 'emailHasBeenValid')) {
      set(this, 'emailHasBeenValid', true);
    }

    return emailIsValid;
  },

  passwordIsLongEnough: gte('password.length', 8),

  passwordIsConfirmed: computed('password', 'passwordConfirmation', function() {
    const { password, passwordConfirmation } = this.getProperties('password', 'passwordConfirmation');

    if (!isEmpty(password) && !isEmpty(passwordConfirmation)) {
      return password === passwordConfirmation;
    }

    return false;
  }),

  actions: {
    ditchCurrentUser() {
      set(this, 'session.noReload', true);

      get(this, 'session').invalidate();

      this._resetProperties();
    },

    checkEmail() {
      const email = get(this, 'email');
      const isValid = this.validatesEmailFormatOf(email);

      if (isValid) {
        set(this, 'checkingEmail', true);

        get(this, 'api').isRegisteredUser(email)
        .then(() => {
          set(this, 'alreadyHasAccount', true);
        })
        .catch(() => {
          set(this, 'needsNewAccount', true);
        })
        .finally(() => {
          set(this, 'checkingEmail', false);
        });
      }
    },

    passwordFocusOut() {
      set(this, 'hasAttemptedPassword', true);
    },

    logIn() {
      let {email, password} =  this.getProperties('email', 'password');

      set(this, 'isLoggingIn', true);

      get(this, 'session').authenticate('authenticator:application', email, password)
      .then(() => {
        set(this, 'passwordIsValid', true);
      })
      .catch(() => {
        set(this, 'passwordIsValid', false);
        get(this, 'notify').error('Invalid password. Please try again.');
      })
      .finally(() => {
        if (!get(this, 'hasAttemptedLogin')) {
          set(this, 'hasAttemptedLogin', true);
        }

        set(this, 'isLoggingIn', false);
      });
    },

    signUp() {
      let {name, email, password} =  this.getProperties('name', 'email', 'password');

      setProperties(this, {
        isCreatingUser: true,
        hasCreatedNewUser: false
      });

      set(this, 'isCreatingUser', true);

      get(this, 'api').createRegistration({
        user: {
          name,
          email,
          password,
          password_confirmation: password,
        },
        instant_signup: true
      })
      .then((currentUser) => {
        set(this, 'hasCreatedNewUser', true);
        get(this, 'session').authenticate('authenticator:restore', currentUser);
      })
      .catch(() => {
        get(this, 'notify').error('There was an error logging in. Please try again.');
      })
      .finally(() => {
        set(this, 'isCreatingUser', false);
      });
    },

    checkName() {
      this.validatePresenceOf('name');
    }
  }
});
