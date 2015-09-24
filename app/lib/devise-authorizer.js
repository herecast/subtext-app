import DeviseAuth from 'simple-auth-devise/authorizers/devise';
import config from 'subtext-ui/config/environment';

export default DeviseAuth.extend({
  authorize(jqXHR, requestOptions) {
    jqXHR.setRequestHeader('Consumer-App-Uri', config['consumer-app-uri']);

    this._super(jqXHR, requestOptions);
  }
});
