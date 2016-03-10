//import Ember from 'ember';
import Devise from 'ember-simple-auth/authenticators/devise';
//import config from 'subtext-ui/config/environment';
//import ajax from 'ic-ajax';

export default Devise.extend({
  serverTokenEndpoint: '/api/v3/users/sign_in',
  /*
  authenticate(token) {
    const url = `${config.API_NAMESPACE}/users/email_confirmation`;

    return new Ember.RSVP.Promise((resolve, reject) => {
      ajax(url, {
        type: 'POST',
        data: {
          confirmation_token: token
        }
      }).then((response) => {
        resolve(response);
      }).catch(() => {
        reject();
      });
    });
  }*/
});
