import Ember from 'ember';

const { inject, computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['SearchPagination'],
  search: inject.service(),

  // these should be set when rendering this component
  searchType: null,

  nextPage: computed('search.searchPage', function() {
    const searchPage = get(this, 'search.searchPage');
    if (typeof searchPage === 'number') {
      return searchPage + 1;
    } else {
      return 1;
    }
  })
});
