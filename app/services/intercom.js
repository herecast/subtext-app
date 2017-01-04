import Ember from 'ember';
import config from '../config/environment';

const {
  get,
  set,
  isPresent,
  inject
} = Ember;

export default Ember.Service.extend({
  enableTracking: true,
  fastboot: inject.service(),

  intercom() {
    /**
     * Noop if in fastboot mode
     */
    if(!get(this, 'fastboot.isFastBoot')) {
      window.Intercom(...arguments);
    }
  },

  doTrack() {
    set(this, 'enableTracking', true);
  },

  doNotTrack() {
    set(this, 'enableTracking', false);
  },

  boot(user) {
    // The existing logged out version of Intercom needs to be shutdown
    // so that the logged in version can boot up.
    this.intercom('shutdown');

    const intercomId = config['INTERCOM_API_TOKEN'];
    const userPresent = isPresent(user) && isPresent(get(user, 'email'));

    if (userPresent && get(this, 'enableTracking')) {
      this.intercom('boot', {
        app_id: intercomId,
        email: user.get('email'),
        name: user.get('name'),
        user_id: user.get('userId'),
        created_at: user.get('createdAt'),
        test_group: user.get('testGroup')
      });
    } else {
      // TODO this code is unreachable and probably not
      // needed since the app reloads when the user logs out.
      this.intercom('boot', {
        app_id: intercomId
      });
    }
    // restores custom button behaviour after reboot
    this.intercom('update');
  },

  update(/* user */) {
    if(get(this, 'enableTracking')) {
      // if(isPresent(user)) {
      //   this.intercom('update', {
      //     email: user.get('email'),
      //     name: user.get('name'),
      //     user_id: user.get('userId'),
      //     created_at: user.get('createdAt'),
      //   });
      // } else {
      //   this.intercom('update');
      // }
    }
  },

  contactUs(subject) {
    if (window.Intercom) {
      this.intercom('show');
    } else {
      let url = "mailto:dailyuv@subtext.org?";
      if (subject) {
        url += `subject=${subject}`;
      }
      window.location.href = url;
    }
  },

  showMessenger() {
    this.intercom('show');
  },

  hideMessenger() {
    this.intercom('hide');
  },

  onShow(fn) {
    if (typeof fn === 'function') {
      this.intercom('onShow', () => {
        fn();
      });
    }
  },

  onHide(fn) {
    if (typeof fn === 'function') {
      this.intercom('onHide', () => {
        fn();
      });
    }
  },

  trackEvent(eventName, metadata) {
    if(get(this, 'enableTracking')) {
      this.intercom('trackEvent', eventName, metadata);
    }
  },

  shutdown() {
    this.intercom('shutdown');
  }
});
