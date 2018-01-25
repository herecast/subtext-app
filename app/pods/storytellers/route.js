import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.query('organization', {
      'page': 1,
      'per_page': 100,
      'certified_storyteller': true,
      'certified_social': true
    });
  }
});
