import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {
  computed,
  inject,
  get,
  isBlank,
  isPresent,
  observer,
  RSVP,
  set
} = Ember;

export default Ember.Component.extend(trackEvent, Validation, {
  "data-test-component": 'listserv-registration-form',
  api: inject.service(),
  callToAction: "Register",
  listservName: "",
  email: null,
  name: null,
  locationId: null,
  termsAccepted: true,
  confirmationKey: null,

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  resetProperties() {
    set(this, 'showErrors', false);
    set(this, 'requestErrors', {});
  },

  isValid: computed('allErrors.{email,password,locationId,name,termsAccepted}', function() {
    const errors = get(this, 'allErrors');

    const emailError = get(errors, 'email');
    const passwordError = get(errors, 'password');
    const locationIdError = get(errors, 'locationId');
    const nameError = get(errors, 'name');
    const termsAcceptedError = get(errors, 'termsAccepted');

    return !emailError && !passwordError && !locationIdError && !nameError &&
      !termsAcceptedError;
  }),

  error: computed('showErrors','allErrors.{email,password,locationId,name,termsAccepted}', function() {
    if (get(this, 'showErrors')) {
      return get(this, 'allErrors');
    } else {
      return Ember.Object.create();
    }
  }),

  // If the API returns an error, we need to reset it if the user changes
  // the value in the form so it's no longer displayed.
  updateRequestErrors: observer('email', 'password', function() {
    const email = get(this, 'email');
    const password = get(this, 'password');

    if (isPresent(email)) {
      set(this, 'requestErrors.email', null);
    }
    if (isPresent(password)) {
      set(this, 'requestErrors.password', null);
    }
  }),

  allErrors: computed(
    'requestErrors', 'email', 'password', 'locationId',
    'name', 'termsAccepted', function() {

    const email = get(this, 'email');
    const password = get(this, 'password');
    const locationId = get(this, 'locationId');
    const name = get(this, 'name');
    const termsAccepted = get(this, 'termsAccepted');

    let emailErrorMsg;
    const emailError = get(this, 'requestErrors.email');

    if (isBlank(email)) {
      emailErrorMsg = 'Email cannot be blank';
    } else if (!this.hasValidEmail(email)) {
      emailErrorMsg = 'Email format is invalid';
    } else if (emailError) {
      emailErrorMsg = emailError[0];
    }

    let passwordErrorMsg;
    const passwordError = get(this, 'requestErrors.password');

    if (!this.hasValidPassword(password)) {
      passwordErrorMsg = get(this, 'errors.password');
    } else if (passwordError) {
      passwordErrorMsg = passwordError[0];
    }

    return Ember.Object.create({
      email: emailErrorMsg,
      password: passwordErrorMsg,
      locationId: isPresent(locationId) ? null : 'Location must be selected',
      name: isPresent(name) ? null : 'Name cannot be blank',
      termsAccepted: termsAccepted ? null : 'You must agree to the terms of service'
    });
  }),

  registrationData: computed('name', 'email', 'password', 'locationId', 'confirmationToken', function() {
    return {
      registration: {
        name: get(this, 'name'),
        email: get(this, 'email'),
        password: get(this, 'password'),
        location_id: get(this, 'locationId'),
        confirmation_key: get(this, 'confirmationKey')
      }
    };
  }),

  signInFromRegistration(data) {
    set(this, 'session.skipRedirect', true);
    set(this, 'session.transitionTo', 'none');

    if ( isPresent(data.token) ) {
      return this.get('session').authenticate('authenticator:restore', data);
    } else {
      return this.get('session').authenticate('authenticator:application',
        get(this, 'email'), get(this, 'password'));
    }
  },

  actions: {
    register() {
      set(this, 'showErrors', true);
      const api = get(this, 'api');

      return new RSVP.Promise((resolve, reject) => {
        if (get(this, 'isValid')) {

          api.confirmedRegistration(get(this, 'registrationData')).then(
            data => { this.signInFromRegistration(data); }
          ).then((response) => {
            if('onSuccess' in this.attrs) {
              this.attrs.onSuccess(response);
            }
            resolve();
          }).catch((response) => {
            set(this, 'requestErrors', response.errors);

            reject();
          });
        } else {
          resolve();
        }
      });
    }
  }
});
