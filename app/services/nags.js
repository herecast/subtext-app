import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import moment from 'moment';
import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend({
  fastboot: service(),
  cookies: service(),
  media: service(),
  windowLocation: service(),

  showAppDownloadNag: false,
  appDownloadNagCookieName: 'hasClosedAppDownloadNag',

  init() {
    this._super(...arguments);

    this._setupAppDownloadNag();
  },

  _hasCookie(name) {
    return get(this, 'cookies').read(name);
  },

  _makeCookie(name, expiration = false) {
    const cookies = get(this, 'cookies');
    const windowLocation = get(this, 'windowLocation');
    const timeToExpire = expiration ? expiration : moment().add(5, 'years').toDate();

    cookies.write(name, true, {
      path: '/',
      secure: windowLocation.protocol() === 'https',
      expires: timeToExpire
    });
  },

  _setupAppDownloadNag() {
    const isIOSorAndroid = get(this, 'media.isMobileIOS') || get(this, 'media.isMobileAndroid');
    const isMobileButNotNative = get(this, 'media.isMobileButNotNative');
    const cookieName = get(this, 'appDownloadNagCookieName');
    const hasNoCookie = !this._hasCookie(cookieName);

    if (isIOSorAndroid && isMobileButNotNative && hasNoCookie) {
      set(this, 'showAppDownloadNag', true);
    }
  },

  hasSeenAppDownloadNag() {
    set(this, 'showAppDownloadNag', false);

    const cookieName = get(this, 'appDownloadNagCookieName');
    const timeToExpire = moment().add(7, 'days').toDate();

    this._makeCookie(cookieName, timeToExpire);
  }
});
