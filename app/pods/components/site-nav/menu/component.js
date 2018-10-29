import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'SiteNav-Menu',

  session: service(),

  isLoggedIn: readOnly('session.isAuthenticated'),

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
      get(this, 'session').invalidate();
    },

    onLinkClick() {
      this.send('closeMenu');
    }
  }
});
