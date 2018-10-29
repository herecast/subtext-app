import { computed, get } from '@ember/object';
import Media from 'ember-responsive/services/media';

export default Media.extend({
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
  })
});
