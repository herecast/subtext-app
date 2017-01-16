import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  inject,
  get,
  set,
  observer
  } = Ember;

export default Ember.Controller.extend({
  queryParams: [
    {searchType: {as: 't'}},
    {searchQuery: {as: 'q'}},
    {searchPage: {as: 'pg'}},
    {searchPerPage: {as: 'pp'}},
    {searchLocation: {as: 'loc'}},
    {searchLocationId: {as: 'lid'}},
    {searchDateStart: {as: 'start'}},
    {searchDateEnd: {as: 'end'}},
    {searchOrganization: {as: 'org'}},
    {searchCategory: {as: 'cat'}}
  ],

  search: inject.service(),
  modals: inject.service(),

  onPathChange: Ember.observer('currentPath', function() {
  }),

  currentController: inject.service('current-controller'),
  intercom: inject.service('intercom'),
  newsFilter: inject.controller('news/all'),
  eventsFilter: inject.controller('events/all'),
  talkFilter: inject.controller('talk/all'),
  marketFilter: inject.controller('market/all'),

  searchType: computed.alias('search.searchType'),
  searchQuery: computed.alias('search.searchQuery'),
  searchPage: computed.alias('search.searchPage'),
  searchPerPage: computed.alias('search.searchPerPage'),
  searchLocation: computed.alias('search.searchLocation'),
  searchLocationId: computed.alias('search.searchLocationId'),
  searchDateStart: computed.alias('search.searchDateStart'),
  searchDateEnd: computed.alias('search.searchDateEnd'),
  searchOrganization: computed.alias('search.searchOrganization'),
  searchCategory: computed.alias('search.searchCategory'),

  showHeader: computed.alias('currentController.showHeader'),

  channelLinksEnabled: true,

  showOrHideSearch: observer('currentPath', function() {
    const shouldShow = get(this, 'searchQuery') || get(this, 'search.hasFilter');

    if (shouldShow) {
      if (!get(this, 'search.showSearch')) {
        get(this, 'search').openSearch();
      }
    } else {
      set(this, 'search.showSearch', false);
    }
  }),

  backgroundClass: computed('currentPath', function() {
    const secondaryBackground = get(this, 'currentController.secondaryBackground');
    const secondaryBackgroundMobile = get(this, 'currentController.secondaryBackgroundMobile');
    let klass = '';

    if (secondaryBackground) {
      klass += 'u-colorBgSecondary';
    }
    if (secondaryBackgroundMobile) {
      klass += ' u-colorBgSecondary--mobile';
    }
    return klass;
  }),

  copyrightYear: computed(function() {
    return moment().format('YYYY');
  }),

  actions: {
    openSearch() {
      get(this, 'search').openSearch();
    },

    trackMenuOpen() {
      // The menu opens after the event is fired, so we need to check if it's
      // closed. When the menu closes, the length is 1.
      const menuOpened = Ember.$('.ActionDropdown .dropdown.open').length === 0;

      if (menuOpened) {
        this.get('intercom').trackEvent('avatar-user-menu-opened');
      }
    },

    signOut() {
      get(this, 'session').signOut();
    },

    scrollTo(offset) {
      Ember.$(window).scrollTop(offset);
    }
  }
});
