/* global window */
import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  inject,
  set,
  run,
  computed
} = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['GlobalHeader'],
  currentController  : inject.service(),
  searchService      : inject.service('search'),
  currentChannel     : computed.alias('currentController.currentChannel'),
  modals: inject.service(),
  routing: inject.service('-routing'),
  userLocationService: inject.service('user-location'),
  showSignIn: false,
  showUserMenu: false,
  signInTab: 'sign-in',
  features: inject.service('feature-flags'),
  showSearch: computed.alias('searchService.searchActive'),

  actions: {
    toggleSearch() {
      const searchService = get(this, 'searchService');
      if(get(searchService, 'searchActive')) {
        if(get(searchService, 'query').length) {
          searchService.clearSearch();
        }
      } else {
        run.next(() => {
          this.$('.SearchInput input').focus();
        });
      }

      searchService.toggleProperty('searchActive');
    },
    signOut() {
      const signOut = get(this, 'signOut');
      if (signOut) {
        signOut(...arguments);
      }
    },
    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
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
    },
    logoClicked() {
      Ember.$(window).scrollTop(0);
    },
    updateSearchQuery(query) {
      get(this, 'searchService').performSearch(query);
    }
  }
});
