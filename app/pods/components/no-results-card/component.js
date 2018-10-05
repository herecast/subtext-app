import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: ['NoResults'],
  "data-test-component": 'no-results-card',

  search: service(),
  floatingActionButton: service(),
  routing: service('-routing'),

  hadFilters: computed.readOnly('search.filtersAreActive'),
  hadSearch: computed.readOnly('search.searchActive'),

  hadResults: false,

  actions: {
    showJobsTray() {
      get(this, 'floatingActionButton').expand();
    }
  }
});
