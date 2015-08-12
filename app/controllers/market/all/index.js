import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,
  session: Ember.inject.service('session'),

  queryParams: ['query', 'location', 'r'],

  // Change this value in the query params to force a refresh.
  r: false,

  query: 'Everything',
  location: Ember.computed.oneWay('session.userLocation')
});
