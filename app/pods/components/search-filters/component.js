import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Component.extend({
  classNames: ['SearchFilters'],
  search: inject.service(),

  actions: {
    closeFiltersMenu() {
      get(this, 'search').closeFiltersMenu();
    }
  }
});
