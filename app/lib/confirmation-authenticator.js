import Ember from 'ember';
import DeviseAuth from 'simple-auth-devise/authenticators/devise';
import ajax from 'ic-ajax';
import config from 'subtext-ui/config/environment';

export default DeviseAuth.extend({
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
  }
});
