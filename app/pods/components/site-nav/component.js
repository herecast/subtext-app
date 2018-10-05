import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'SiteNav',

  session: service(),
  modals: service(),

  currentUser: computed.readOnly('session.currentUser'),

  hideAll: computed.readOnly('session.isFastBoot'),
  showAvatar: computed.readOnly('session.isAuthenticated'),

  showMenu: false,

  actions: {
    toggleMenu() {
      this.toggleProperty('showMenu');

      if (get(this, 'showMenu')) {
        get(this, 'modals').addModalBodyClass();
      } else {
        get(this, 'modals').removeModalBodyClass();
      }
    }
  }
});
