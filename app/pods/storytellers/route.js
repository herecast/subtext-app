import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.query('organization', {
      'page': 1,
      'per_page': 100,
      'subtext_certified': true
    });
  }
});
