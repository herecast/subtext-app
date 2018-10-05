// global window
import Ember from 'ember';

const {
  inject,
  computed,
  get,
  set,
  setProperties
} = Ember;

export default Ember.Service.extend({
  routing: inject.service('-routing'),
  query: "",
  isLoading: false,
  searchActive: false,

  activeFilter: null,
  filtersAreActive: computed.notEmpty('activeFilter'),

  performSearch(query) {
    setProperties(this, {
      isLoading: true,
      query: query
    });

    Ember.$(window).scrollTop(0,0);
    get(this, 'routing').transitionTo('feed',
      [],
      {query: query, type: "", startDate: '', endDate: ''}
    ).finally(() => {
      set(this, 'isLoading', false);
    });
  },

  clearSearch() {
    this.performSearch("");
  }
});
