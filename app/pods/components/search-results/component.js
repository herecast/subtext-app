import Ember from 'ember';

const { inject, computed, isBlank, get } = Ember;

export default Ember.Component.extend({
  search: inject.service(),

  // these should be set when the component is rendered
  searchType: null,
  promise: null,

  showContent: computed('searchType', 'search.searchType', 'promise.isLoading', 'promise.length', function() {
    const selectedSearchType = get(this, 'search.searchType');

    if (isBlank(selectedSearchType)) {
      return get(this, 'promise.isLoading') || get(this, 'promise.length');
    } else {
      return selectedSearchType === get(this, 'searchType');
    }
  })
});
