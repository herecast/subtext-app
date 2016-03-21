import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  searchController: inject.controller('directory.search'),
  results: computed.oneWay('searchController.results'),
  lat: computed.oneWay('searchController.lat'),
  lng: computed.oneWay('searchController.lng'),
  query: computed.oneWay('searchController.query'),
  sort_by: computed.alias('searchController.sort_by')
});
