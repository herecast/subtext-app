import { computed, get } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive/services/media';

export default Media.extend({
  fastboot: service(),

  isNativeMobileApp: computed('isMobile', function() {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;

      return userAgent.indexOf('subtext-') !== -1;
    }

    return false;
  }),

  isMobileButNotNative: computed('isNativeMobileApp', 'isMobile', function() {
    const isNativeMobileApp = get(this, 'isNativeMobileApp');
    const isMobile = get(this, 'isMobile');

    return isMobile && !isNativeMobileApp;
  }),

  mobileOperatingSystem: computed('isMobile', function() {
    let mobileOperatingSystem = null;

    if (get(this, 'isMobile')) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera || null;

      if (/windows phone/i.test(userAgent)) {
        mobileOperatingSystem = 'windows';
      } else if (/android/i.test(userAgent)) {
        mobileOperatingSystem = 'android';
      } else if (/iPad|iPhone|iPod|iOS/.test(userAgent) && !window.MSStream) {
        mobileOperatingSystem = 'ios';
      }
    }

    return mobileOperatingSystem
  }),

  isMobileIOS: equal('mobileOperatingSystem', 'ios'),

  isMobileAndroid: equal('mobileOperatingSystem', 'android')
});
