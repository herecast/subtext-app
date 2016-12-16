import Devise from 'ember-simple-auth/authorizers/devise';
import config from 'subtext-ui/config/environment';

export default Devise.extend({
  authorize(data, header) {
    header('Consumer-App-Uri', config['CONSUMER_APP_URI']);
    this._super(data, header);
  }
});
