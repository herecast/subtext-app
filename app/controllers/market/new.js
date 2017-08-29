import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['organization_id', 'job'],
  organization_id: null,
  job: null
});
