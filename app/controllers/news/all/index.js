import Ember from 'ember';

export default Ember.Controller.extend({
  refreshParam: Ember.inject.service('refresh-param'),

  queryParams: ['query', 'location', 'publication', 'r'],

  // Change this value in the query params to force a refresh.
  r: false,

  query: 'Everything',
  location: Ember.computed.oneWay('session.userLocation'),
  publication: 'Everyone'
});
