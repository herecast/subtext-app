import Ember from 'ember';
import moment from 'moment';

const { set, get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'AppDownloadNag',
  classNameBindings: ['showNag:open:closed'],
  'data-test-nag-visible': computed.readOnly('showNag'),

  appIcon: {
    imageURL: 'https://s3.amazonaws.com/subtext-misc/dailyuv-app-logo.png'
  },
  androidStore: {
    linkURL: 'https://play.google.com/store/apps/details?id=com.subtext.android.dailyuv',
    imageURL: 'https://s3.amazonaws.com/subtext-misc/android-app-store.png'
  },
  appleStore: {
    linkURL: 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1386402414&mt=8',
    imageURL: 'https://s3.amazonaws.com/subtext-misc/apple-app-store.png'
  },

  cookies: service(),
  media: service(),
  windowLocation: service('window-location'),

  showNag: false,

  _hasNoCookieInPlace() {
    const cookies = get(this, 'cookies');

    return !cookies.read('hideAppDownloadNag');
  },

  _makeCookie() {
    const cookies = get(this, 'cookies');
    const windowLocation = get(this, 'windowLocation');

    cookies.write('hideAppDownloadNag', true, {
      path: '/',
      secure: windowLocation.protocol() === 'https',
      expires: moment().add(7, 'days').toDate()
    });
  },

  didInsertElement() {
    this._super(...arguments);

    if ( this._hasNoCookieInPlace() && get(this, 'media.isMobileButNotNative')) {
      set(this, 'showNag', true);
      this.tracking.trackAppDownloadNagEvent('show-nag');
    }
  },

  actions: {
    closeNag() {
      set(this, 'showNag', false);

      this.tracking.trackAppDownloadNagEvent('close-nag');

      this._makeCookie();
    },

    clickAndroidStore() {
      this.tracking.trackAppDownloadNagEvent('click-android-store');
    },

    clickAppleStore() {
      this.tracking.trackAppDownloadNagEvent('click-apple-store');
    }
  }
});
