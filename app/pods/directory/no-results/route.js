import Ember from 'ember';

export default Ember.Route.extend({
  afterModel() {
    const currentRoute = this.container.lookup('controller:application').currentRouteName;

    // redirect on page refresh or deep link
    if (currentRoute === 'loading') {
      this.transitionTo('directory.landing');
    }
  }
});
