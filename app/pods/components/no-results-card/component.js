import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['NoResults'],
  "data-test-component": 'no-results-card',

  search: service(),
  floatingActionButton: service(),

  hadFilters: readOnly('search.filtersAreActive'),
  hadSearch: readOnly('search.searchActive'),

  hadResults: false,

  actions: {
    showJobsTray() {
      get(this, 'floatingActionButton').expand();
    }
  }
});
