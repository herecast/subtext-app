import Ember from 'ember';

export default Ember.Route.extend({

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  }
});
