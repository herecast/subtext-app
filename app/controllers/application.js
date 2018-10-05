import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend({
  modals: inject.service(),
  elsewhere: inject.service('ember-elsewhere'),
  searchService: inject.service('search'),
  searchOpen: computed.alias('searchService.searchActive'),

  currentController: inject.service('current-controller'),
  routing: inject.service('_routing'),
  router: computed.alias('routing.router'),

  showUserLocationBar: false,

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

  setShowUserLocationBar(bool) {
    set(this, 'showUserLocationBar', bool);
  },

  actions: {
    signOut() {
      get(this, 'session').signOut();
    },

    scrollTo(offset) {
      Ember.$(window).scrollTop(offset);
    }
  }
});
