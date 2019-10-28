import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'SiteNav-Menu',

  session: service(),
  userLocation: service(),

  userLocationName: readOnly('userLocation.userLocation.name'),

  isLoggedIn: readOnly('session.isAuthenticated'),
  currentUser: readOnly('session.currentUser'),

  wantsToSignOut: false,

  actions: {
    closeMenu() {
      if (get(this, 'onClose')) {
        get(this, 'onClose')();
      }
    },

    toggleWantsToSignOut() {
      this.toggleProperty('wantsToSignOut');
    },

    signOut() {
      get(this, 'session').signOut();
    }
  }
});
