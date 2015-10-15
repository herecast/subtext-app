import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import Validation from '../mixins/components/validation';

const isPresent = Ember.isPresent;

export default Ember.Controller.extend(Validation, {
  secondaryBackground: true,

  isValid: function() {
    const email = this.get('email');
    const password = this.get('password');
    const locationId = this.get('locationId');
    const name = this.get('name');
    const termsAccepted = this.get('termsAccepted');

    return isPresent(email) && this.hasValidEmail(email) &&
      isPresent(password) && isPresent(locationId) && isPresent(name) &&
      termsAccepted;
  }.property('email', 'password', 'locationId', 'name', 'termsAccepted'),

  actions: {
    register(callback) {
      const url = `${config.API_NAMESPACE}/users/sign_up`;
      const password = this.get('password');
      const email = this.get('email');

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
        this.set('error', response.jqXHR.responseJSON.errors);
        const promise = new Ember.RSVP.Promise((resolve, reject) => { reject(); });

        callback(promise);
      });
    }
  }
});
