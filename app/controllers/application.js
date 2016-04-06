import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';
import moment from 'moment';

const {
  computed,
  inject,
  get
} = Ember;

export default Ember.Controller.extend(trackEvent, {
  currentController: inject.service('current-controller'),
  intercom: inject.service('intercom'),
  newsFilter: inject.controller('news/all/index'),
  eventsFilter: inject.controller('events/all/index'),
  talkFilter: inject.controller('talk/all/index'),
  marketFilter: inject.controller('market/all/index'),

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
    trackUserMenu(navControlText) {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'User Account Menu',
        navControl: navControlText
      });
    },

    trackHome() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Header',
        navControl: 'Home'
      });
    },

    trackHelp() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Header',
        navControl: 'Help'
      });
    },

    trackChannel(channel) {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Channel Buttons',
        navControl: channel
      });
    },

    trackRegistration(navControlText) {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Registration',
        navControl: navControlText
      });
    },

    trackMenuOpen() {
      // The menu opens after the event is fired, so we need to check if it's
      // closed. When the menu closes, the length is 1.
      const menuOpened = Ember.$('.ActionDropdown .dropdown.open').length === 0;

      if (menuOpened) {
        this.get('intercom').trackEvent('avatar-user-menu-opened');
      }
    }
  }
});
