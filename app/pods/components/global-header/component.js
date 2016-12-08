import Ember from 'ember';

const {
  get,
  inject,
  set,
  computed
} = Ember;

export default Ember.Component.extend({
  currentController  : inject.service(),
  currentChannel     : computed.alias('currentController.currentChannel'),
  modals: inject.service(),
  routing: inject.service('-routing'),
  showSignIn: false,
  showUserMenu: false,
  signInTab: 'sign-in',

  channelLinksEnabled: true,

  displayChannelLinks: computed('channelLinksEnabled', 'media.isNotMobile', function() {
    return get(this, 'channelLinksEnabled') && get(this, 'media.isNotMobile');
  }),

  actions: {
    openSearch() {
      this.sendAction('openSearch');
    },
    trackMenuOpen() {
      if ('trackMenuOpen' in this.attrs) {
        this.attrs.trackMenuOpen(...arguments);
      }
    },
    signOut() {
      if ('signOut' in this.attrs) {
        this.attrs.signOut(...arguments);
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
