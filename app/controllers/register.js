import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import Validation from '../mixins/components/validation';

const {
  computed,
  get,
  isBlank,
  isPresent,
  observer,
  RSVP,
  set
} = Ember;

export default Ember.Controller.extend(Validation, {
  secondaryBackground: true,

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
  updateRequestErrors: observer('email', function() {
    const email = get(this, 'email');

    if (isPresent(email)) {
      set(this, 'requestErrors.email', null);
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
      emailErrorMsg = emailError;
    }

    return Ember.Object.create({
      email: emailErrorMsg,
      password: isPresent(password) ? null : 'Password cannot be blank',
      locationId: isPresent(locationId) ? null : 'Location must be selected',
      name: isPresent(name) ? null : 'Name cannot be blank',
      termsAccepted: termsAccepted ? null : 'You must agree to the terms of service'
    });
  }),

  actions: {
    register(callback) {
      set(this, 'showErrors', true);

      const url = `${config.API_NAMESPACE}/users/sign_up`;
      const password = this.get('password');
      const email = this.get('email');

      if (get(this, 'isValid')) {
        ajax(url, {
          type: 'POST',
          dataType: "json",
          data: {
            user: {
              name: this.get('name'),
              location_id: this.get('locationId'),
              email: email,
              password: password,
              password_confirmation: password
            }
          }
        }).then(() => {
          this.transitionTo('register.complete');
        }).catch((response) => {
          set(this, 'requestErrors', response.jqXHR.responseJSON.errors);

          callback(RSVP.reject());
        });
      } else {
        callback(RSVP.resolve());
      }
    }
  }
});
