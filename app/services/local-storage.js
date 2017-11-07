//global localStorage
import Ember from 'ember';

const {
  inject: {service},
  computed,
  get
} = Ember;

export default Ember.Service.extend({
  fastboot: service(),
  isLocalStorageSupported: computed('fastboot.isFastBoot', function() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');

    return !isFastBoot && (typeof localStorage !== 'undefined');
  }),

  setItem(key, value) {
    if(get(this, 'isLocalStorageSupported')) {
      localStorage.setItem(key, value);
    }
  },

  getItem(key) {
    if(get(this, 'isLocalStorageSupported')) {
      return localStorage.getItem(key);
    }
  },

  removeItem(key) {
    if(get(this, 'isLocalStorageSupported')) {
      return localStorage.removeItem(key);
    }
  }
});
