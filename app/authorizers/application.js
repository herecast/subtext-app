import Devise from 'ember-simple-auth/authorizers/devise';
import config from 'subtext-ui/config/environment';

export default Devise.extend({
  authorize(data, header) {
    header('Consumer-App-Uri', config['consumer-app-uri']);
    this._super(data, header);
  }
});
