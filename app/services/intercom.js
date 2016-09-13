import Ember from 'ember';
import config from '../config/environment';

const { get, set } = Ember;

export default Ember.Service.extend({
  enableTracking: true,

  doTrack() {
    set(this, 'enableTracking', true);
  },

  doNotTrack() {
    set(this, 'enableTracking', false);
  },

  boot(user) {
    // The existing logged out version of Intercom needs to be shutdown
    // so that the logged in version can boot up.
    window.Intercom('shutdown');

    const intercomId = config['intercom-api-token'];
    if(get(this, 'enableTracking')) {
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
    }
  },

  update(/*user*/) {
    if(get(this, 'enableTracking')) {
      window.Intercom('update', {
        // TODO: pass user attributes here if they change (i.e. email, name, etc)
      });
    }
  },

  contactUs(subject) {
    let intercomButton = Ember.$('.intercom-launcher-button');
    if(intercomButton.length > 0){
      intercomButton[0].click();
    } else {
      let url = "mailto:dailyuv@subtext.org?";
      if (subject) {
        url += `subject=${subject}`;
      }
      window.location.href = url;
    }
  },

  trackEvent(eventName, metadata) {
    if(get(this, 'enableTracking')) {
      window.Intercom('trackEvent', eventName, metadata);
    }
  },

  shutdown() {
    window.Intercom('shutdown');
  }
});
