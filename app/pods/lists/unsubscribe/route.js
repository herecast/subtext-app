import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('listserv', params.listserv_id);
  }
});
