import Ember from 'ember';

const { getOwner } = Ember;

export default Ember.Route.extend({
  afterModel() {
    const currentRoute = getOwner(this).lookup('controller:application').currentRouteName;

    // redirect on page refresh or deep link
    if (currentRoute === 'loading') {
      this.transitionTo('directory.landing');
    }
  }
});
