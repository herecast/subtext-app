import Ember from 'ember';
import Media from 'ember-responsive/media';

const { get, computed } = Ember;

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
