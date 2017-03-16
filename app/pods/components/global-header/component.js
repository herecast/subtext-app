import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  inject,
  set,
  computed
} = Ember;

export default Ember.Component.extend(TestSelector, {
  currentController  : inject.service(),
  currentChannel     : computed.alias('currentController.currentChannel'),
  modals: inject.service(),
  routing: inject.service('-routing'),
  showSignIn: false,
  showUserMenu: false,
  signInTab: 'sign-in',
  features: inject.service('feature-flags'),

  channelLinksEnabled: true,

  actions: {
    openSearch() {
      this.sendAction('openSearch');
    },
    trackMenuOpen() {
      const trackMenuOpen = get(this, 'trackMenuOpen');
      if (trackMenuOpen) {
        trackMenuOpen(...arguments);
      }
    },
    signOut() {
      const signOut = get(this, 'signOut');
      if (signOut) {
        signOut(...arguments);
      }
    },
    showSignInMenu(tab) {
      const isShown = get(this, 'showSignIn');
      const prevTab = get(this, 'signInTab');

      if(isShown && (prevTab === tab)) {
        this.send('closeSignInMenu');
      } else {
        set(this, 'signInTab', tab);
        set(this, 'showSignIn', true);
      }
    },
    registerModal() {
      get(this, 'modals').showModal('modals/sign-in-register', 'register');
    },
    closeSignInMenu() {
      set(this, 'showSignIn', false);
    },
    toggleUserMenu() {
      this.toggleProperty('showUserMenu');
    },
    openAccountSettings() {
      set(this, 'showUserMenu', false);
      get(this, 'routing').transitionTo('account');
    }
  }
});
