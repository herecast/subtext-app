import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['preview', 'organization_id'],
  preview: false,
  organization_id: null
});
