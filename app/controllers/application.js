import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Controller.extend(trackEvent, {
  intercom: Ember.inject.service('intercom'),
  newsFilter: Ember.inject.controller('news/all/index'),
  eventsFilter: Ember.inject.controller('events/all/index'),
  talkFilter: Ember.inject.controller('talk/all/index'),
  marketFilter: Ember.inject.controller('market/all/index'),

  backgroundClass: function() {
    const currentController = this.controllerFor(this.get('currentPath'));
    let klass = '';
    if (Ember.isPresent(currentController) && currentController.get('secondaryBackground')) {
      klass += 'u-colorBgSecondary';
    }
    if (Ember.isPresent(currentController) && currentController.get('secondaryBackgroundMobile')) {
      klass += ' u-colorBgSecondary--mobile';
    }
    return klass;
  }.property('currentPath'),

  _getTrackingArguments(section) {
    return {
      navControlGroup: 'Channel Buttons',
      navControl: section
    };
  },

  actions: {
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
