import Devise from 'ember-simple-auth/authenticators/devise';
import config from 'subtext-ui/config/environment';

const apiHost = config.API_HOST;

export default Devise.extend({
  serverTokenEndpoint: `${apiHost}/${config.API_NAMESPACE}/users/sign_in`,
});
