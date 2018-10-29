import Service, { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import $ from 'jquery';

export default Service.extend({
  enableTracking: true,
  intercomInitPromise: null,
  fastboot: service(),

  _loadIntercom() {
    if (this.intercomInitPromise) { return this.intercomInitPromise; }

    this.intercomInitPromise = new Promise((resolve) => {
      window.intercomSettings = { app_id: 't4i5jg89' };

      $.getScript(`https://widget.intercom.io/widget/t4i5jg89`, function() {
        resolve();
      });
    });

    return this.intercomInitPromise;
  },

  intercom() {
    if(!get(this, 'fastboot.isFastBoot')) {
      if (window.Intercom) {
        window.Intercom(...arguments);
      } else {
        this._loadIntercom().then(() => {
          window.Intercom(...arguments);
        });
      }
    }
  },

  doTrack() {
    set(this, 'enableTracking', true);
  },

  doNotTrack() {
    set(this, 'enableTracking', false);
  },

  update(user) {
    if(get(this, 'enableTracking')) {
      if(isPresent(user)) {
        this.intercom('update', {
          email: user.get('email'),
          name: user.get('name'),
          user_id: user.get('userId'),
          created_at: user.get('createdAt'),
          test_group: user.get('testGroup')
        });
      } else {
        this.intercom('update');
      }
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

  shutdown() {
    this.intercom('shutdown');
  }
});
