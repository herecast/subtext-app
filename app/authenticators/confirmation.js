import Ember from 'ember';
import Devise from 'ember-simple-auth/authenticators/devise';
import config from 'subtext-ui/config/environment';

const { run } = Ember;

const apiHost = config.API_BASE_URL;
export default Devise.extend({
  serverTokenEndpoint: `${apiHost}/${config.API_NAMESPACE}/users/email_confirmation`,

  authenticate(token) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const data = {
        confirmation_token: token
      };

      return this.makeRequest(data).then(
        (response) => run(null, resolve, response),
        (xhr) => run(null, reject, xhr.responseJSON || xhr.responseText)
      );
    });
  }
});
