import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import trackEvent from 'subtext-ui/mixins/track-event';
/* global dataLayer */

const {
  computed,
  inject,
  get,
  isBlank,
  isPresent,
  merge,
  observer,
  RSVP,
  set
} = Ember;

export default Ember.Component.extend(trackEvent, Validation, {
  tagName: 'form',
  classNames: ['RegistrationForm'],
  'data-test-component': 'registration-form',

  api: inject.service(),
  store: inject.service(),
  termsAccepted: null,

  listservs: null,

  digests: computed(function() {
    return get(this, 'store').findAll('digest');
  }),

  selectedDigests: computed('digests.@each.checked', function() {
    return get(this, 'digests').filter((digest) => {
      return get(digest, 'checked');
    });
  }),

  submit() {
    this.registerUser();
  },

  alertGTM() {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'registration-subscribe'
      });
    }
  },

  _saveDigestSubscriptions(digests) {
    const store = get(this, 'store');
    const baseProperties = {
      email  : get(this, 'email'),
      userId : null
    };

    digests.forEach((digest) => {
      store.findRecord('listserv', get(digest, 'id')).then(function(listserv) {
        const properties = {
          name: get(digest, 'name'),
          listserv: listserv
        };

        store.createRecord('subscription', merge(baseProperties, properties)).save();
      });
    });

    this.alertGTM();
  },

  registerUser() {
    set(this, 'showErrors', true);
    const api = get(this, 'api');
    const password = this.get('password');
    const email = this.get('email');

    this.trackEvent('submitSignUp', { });

    return new RSVP.Promise((resolve, reject) => {
      if (get(this, 'isValid')) {
        return api.createRegistration({
          user: {
            name: this.get('name'),
            location_id: this.get('locationId'),
            email: email,
            password: password,
            password_confirmation: password
          }
        }).then((response) => {
          this.trackEvent('createSignup', { });

          const selectedDigests = get(this, 'selectedDigests');
          if (isPresent(selectedDigests)) {
            this._saveDigestSubscriptions(selectedDigests);
          }

          if ('onSuccess' in this.attrs) {
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
  },

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

  actions: {
    register() {
      return this.registerUser();
    }
  }
});
