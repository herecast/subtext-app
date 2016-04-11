import Devise from 'ember-simple-auth/authenticators/devise';
import config from 'subtext-ui/config/environment';

export default Devise.extend({
  serverTokenEndpoint: `${config.API_NAMESPACE}/users/sign_in`,
});
