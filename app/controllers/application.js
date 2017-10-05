import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  inject,
  get
} = Ember;

export default Ember.Controller.extend({
  modals: inject.service(),
  elsewhere: inject.service('ember-elsewhere'),
  hasHeaderPageToolbar: computed.bool('elsewhere.actives.page-toolbar.length'),

  currentController: inject.service('current-controller'),
  routing: inject.service('_routing'),
  router: computed.alias('routing.router'),
  intercom: inject.service('intercom'),

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
