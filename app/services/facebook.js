import { set, get } from '@ember/object';
import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import $ from 'jquery';
import config from 'subtext-ui/config/environment';

export default Service.extend({
  fastboot: service(),
  fbInitPromise: null,
  isLoaded: false,

  preload() {
    if (!get(this, 'fastboot.isFastBoot') && typeof window.FB === 'undefined' && !get(this, 'isLoaded')) {
      this._loadFB().then(() => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'isLoaded', true);
        }
      });
    }
  },

  _loadFB() {
    if (this.fbInitPromise) { return this.fbInitPromise; }

    const initSettings = {
        appId: config.FACEBOOK_APP_ID,
        version: 'v2.11',
        xfbml: true
      };

    this.fbInitPromise = new Promise((resolve) => {
      $.getScript(`https://connect.facebook.net/en_US/sdk.js`, function() {
        window.FB.init(initSettings);
        resolve();
      });
    });

    return this.fbInitPromise;
  },

  FB(method, ...params) {
    if(!get(this, 'fastboot.isFastBoot')) {
      if (window.FB) {
        window.FB[method](...params);
      } else {
        this._loadFB().then(() => {
          window.FB[method](...params);
        });
      }
    }
  },

  ui(params) {
    this.FB('ui', params);
  },

  login(callback, options={}) {
    this.FB('login', callback, options);
  }
});
