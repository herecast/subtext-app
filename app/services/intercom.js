import Ember from 'ember';
import config from '../config/environment';

const { get, set, isPresent } = Ember;

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

    if(isPresent(user) && get(this, 'enableTracking')) {
      window.Intercom('boot', {
        app_id: intercomId,
        email: user.get('email'),
        name: user.get('name'),
        user_id: user.get('userId'),
        created_at: user.get('createdAt'),
        test_group: user.get('testGroup')
      });
    } else {
      window.Intercom('boot', {
        app_id: intercomId
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
    let intercom = window.Intercom;

    if (intercom) {
      window.Intercom('show');
    } else {
      let url = "mailto:dailyuv@subtext.org?";
      if (subject) {
        url += `subject=${subject}`;
      }
      window.location.href = url;
    }
  },

  showMessenger() {
    window.Intercom('show');
  },

  hideMessenger() {
    window.Intercom('hide');
  },

  onShow(fn) {
    if (typeof fn === 'function') {
      window.Intercom('onShow', () => {
        fn();
      });
    }
  },

  onHide(fn) {
    if (typeof fn === 'function') {
      window.Intercom('onHide', () => {
        fn();
      });
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
