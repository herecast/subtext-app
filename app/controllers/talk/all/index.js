import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,
  refreshParam: Ember.inject.service('refresh-param'),

  queryParams: ['query', 'r'],

  // Change this value in the query params to force a refresh.
  r: false,

  query: 'Everything'
});
