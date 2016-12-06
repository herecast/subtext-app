import Ember from 'ember';

const {get, isPresent, inject} = Ember;

export default Ember.Route.extend( {
  api: inject.service(),

  model(params) {
    return this.store.findRecord('subscription', params.id);
  },

  afterModel(model) {
    const confirmed_at =  get(model, 'confirmedAt');

    if( isPresent(confirmed_at) ) {
      this.transitionTo('lists.manage', model);
    } else {
      this.confirm(model);
    }
  },

  confirm(model) {
    const api = get(this, 'api');

    api.confirmListservSubscription(model.id);
  }


});
