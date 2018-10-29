import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import RSVP from 'rsvp';
import Cookie from 'ember-simple-auth/session-stores/cookie';

const fiveYears = (5 * 365 * 24 * 60 * 60);

export default Cookie.extend({
  fastboot: service(),
  cookieExpirationTime: fiveYears,

  restore() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if(isFastBoot) {
      return RSVP.resolve({});
    } else {
      return this._super();
    }
  },

  persist(data) {
    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if(isFastBoot) {
      return RSVP.resolve();
    } else {
      return this._super(data);
    }
  },
  clear() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if(isFastBoot) {
      return RSVP.resolve();
    } else {
      return this._super();
    }
  },

  _renew() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if(isFastBoot) {
      return RSVP.resolve();
    } else {
      return this._super();
    }
  }
});
