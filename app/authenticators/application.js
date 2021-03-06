import Devise from 'ember-simple-auth/authenticators/devise';
import config from 'subtext-app/config/environment';

const apiHost = config.API_BASE_URL;

export default Devise.extend({
  serverTokenEndpoint: `${apiHost}/${config.API_NAMESPACE}/users/sign_in`
});
