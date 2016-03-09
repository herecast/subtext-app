import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    const searchController = this.controllerFor('directory.search');

    searchController.set('selectedResult', null);
  }
});
