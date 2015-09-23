import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
  boot(user) {
    // The existing logged out version of Intercom needs to be shutdown
    // so that the logged in version can boot up.
    window.Intercom('shutdown');

    const intercomId = config['intercom-api-token'];

    window.Intercom('boot', {
      app_id: intercomId,
      email: user.get('email'),
      name: user.get('name'),
      user_id: user.get('userId'),
      created_at: user.get('createdAt'),
      test_group: user.get('testGroup'),
      widget: {
        activator: '#IntercomDefaultWidget'
      }
    });
  },

  update(/*user*/) {
    window.Intercom('update', {
      // TODO: pass user attributes here if they change (i.e. email, name, etc)
    });
  },

  trackEvent(eventName, metadata) {
    window.Intercom('trackEvent', eventName, metadata);
  },

  shutdown() {
    window.Intercom('shutdown');
  }
});
