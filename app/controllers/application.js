import Ember from 'ember';

export default Ember.Controller.extend({
  intercom: Ember.inject.service('intercom'),

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
    }
  }
});
