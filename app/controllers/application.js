import Ember from 'ember';

export default Ember.Controller.extend({
  intercom: Ember.inject.service('intercom'),
  newsFilter: Ember.inject.controller('news/all/index'),
  eventsFilter: Ember.inject.controller('events/all/index'),
  talkFilter: Ember.inject.controller('talk/all/index'),
  marketFilter: Ember.inject.controller('market/all/index'),
  mixpanel: Ember.inject.service('mixpanel'),

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

  actions: {
    trackMenuOpen() {
      // The menu opens after the event is fired, so we need to check if it's
      // closed. When the menu closes, the length is 1.
      const menuOpened = Ember.$('.ActionDropdown .dropdown.open').length === 0;

      if (menuOpened) {
        this.get('intercom').trackEvent('avatar-user-menu-opened');
      }
    },

    trackChannelSelection(section) {
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};
  
      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
          mixpanel.getNavigationProperties(section.capitalize(), section + '.index', 1));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Channel Buttons', section));

      this.get('mixpanel').trackEvent('selectNavControl', props);
    },

    trackChannelCreation(section) {
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};
  
      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
          mixpanel.getNavigationProperties(section.capitalize(), section + '.index', 1));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Create Content', 'Create' + section.capitalize() ));

      this.get('mixpanel').trackEvent('selectNavControl', props);
    },
  }
});
