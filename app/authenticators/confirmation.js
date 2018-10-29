import { Promise } from 'rsvp';
import { run } from '@ember/runloop';
import Devise from 'ember-simple-auth/authenticators/devise';
import config from 'subtext-ui/config/environment';
import { detectResponseStatus } from 'subtext-ui/lib/request-utilities';

const apiHost = config.API_BASE_URL;

export default Devise.extend({
  serverTokenEndpoint: `${apiHost}/${config.API_NAMESPACE}/users/email_confirmation`,

  authenticate(token) {
    const useResponse = this.get('rejectWithResponse');
    const { resourceName, identificationAttributeName, tokenAttributeName } = this.getProperties('resourceName', 'identificationAttributeName', 'tokenAttributeName');
    return new Promise((resolve, reject) => {
      const data = {
        confirmation_token: token
      };

      return this.makeRequest(data).then(detectResponseStatus).then((response) => {
      /**
       * Copied from: https://github.com/simplabs/ember-simple-auth/blob/master/addon/authenticators/devise.js#L144
       */
        if (response.ok) {
          response.json().then((json) => {
            if (this._validate(json)) {
              const _json = json[resourceName] ? json[resourceName] : json;
              run(null, resolve, _json);
            } else {
              run(null, reject, `Check that server response includes ${tokenAttributeName} and ${identificationAttributeName}`);
            }
          });
        } else {
          if (useResponse) {
            run(null, reject, response);
          } else {
            response.json().then((json) => run(null, reject, json));
          }
        }
      }, reject);
    });
  }
});
