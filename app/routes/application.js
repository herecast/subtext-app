import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  beforeModel() {
    const session = this.get('session');

    return session.getCurrentUser();
  }
});
