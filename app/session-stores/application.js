import Ember from 'ember';
import Cookie from 'ember-simple-auth/session-stores/cookie';

const { get, RSVP, inject } = Ember;

export default Cookie.extend({
  fastboot: inject.service(),

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
  },
});
