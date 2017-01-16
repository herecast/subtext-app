import Ember from 'ember';
import Cookie from 'ember-simple-auth/session-stores/cookie';

const { get, getOwner, RSVP, computed } = Ember;

export default Cookie.extend({
  /**
   * Overriden here to disable authenticated fastboot requests.
   */
  fastboot: computed(function() {
    const owner = getOwner(this);

    return owner && owner.lookup('service:fastboot');
  }),

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
