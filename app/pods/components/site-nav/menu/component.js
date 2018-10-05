import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'SiteNav-Menu',

  session: service(),

  isLoggedIn: computed.readOnly('session.isAuthenticated'),

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
