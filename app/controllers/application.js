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

    trackClick(section) {
      const props = {};
      props['userId'] = this.get('session.currentUser.userId');
      props['userName'] = this.get('session.currentUser.name');
      props['userEmail'] = this.get('session.currentUser.email');
      props['userCommunity'] = this.get('session.currentUser.location');
      props['testGroup'] = this.get('session.currentUser.testGroup');

      props['channelName'] = section.capitalize();
      props['pageName'] = section + '.index';
      props['url'] = window.location.href;
      props['pageNumber'] = 1;

      props['navControlGroup'] = 'Channel Buttons';
      props['navControl'] = section;

      this.get('mixpanel').trackEvent('selectNavControl', props);
    }
  }
});
