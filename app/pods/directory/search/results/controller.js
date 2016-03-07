import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Controller.extend({
  searchController: inject.controller('directory.search'),
  results: computed.oneWay('searchController.results')
});
