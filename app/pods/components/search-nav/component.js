import Ember from 'ember';

const { get, setProperties, computed, inject } = Ember;

export default Ember.Component.extend({
  classNames: ['SearchNav'],

  search: inject.service(),
  keyForScrollHook: 'scroll.blurInput',

  placeholder: computed('search.searchType', function() {
    const searchType = get(this, 'search.searchType');
    return 'Search ' + (searchType ? searchType : 'everything');
  }),

  canFilter: computed('search.searchType', function() {
    //const searchType = get(this, 'search.searchType');
    //return searchType === 'news' || searchType === 'market' || searchType === 'events';
    return false; // disabled for now
  }),

  sortedSearchResultChannels: computed(
    'search',
    'search.searchNewsTotal',
    'search.searchEventsTotal',
    'search.searchTalkTotal',
    'search.searchMarketTotal',
    function() {
      return [
        { name: 'news',   size: get(this, 'search.searchNewsTotal')   },
        { name: 'events', size: get(this, 'search.searchEventsTotal') },
        { name: 'talk',   size: get(this, 'search.searchTalkTotal')   },
        { name: 'market', size: get(this, 'search.searchMarketTotal') }
      ].sort(function(a, b) {
        // descending order: largest size to lowest
        return b.size - a.size;
      });
    }
  ),

  showNoResultsMessage: computed(
    'search',
    'search.searchNewsTotal',
    'search.searchEventsTotal',
    'search.searchTalkTotal',
    'search.searchMarketTotal',
    'search.searchType',
    function() {
      const { searchNewsTotal, searchEventsTotal, searchTalkTotal, searchMarketTotal } = get(this, 'search');

      return (searchNewsTotal + searchEventsTotal +  searchTalkTotal + searchMarketTotal === 0);
    }
  ),

  didInsertElement() {
    this._super(...arguments);
    const $searchInput = this.$('.SearchInput-input');

    Ember.run.later(this, function() {
      $searchInput.focus();
    }, 200);

    this.$().on(get(this, 'keyForScrollHook'), function() {
      $searchInput.blur();
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$().off(get(this, 'keyForScrollHook'));
  },

  actions: {
    openFiltersMenu() {
      get(this, 'search').openFiltersMenu();
    },

    closeSearch() {
      get(this, 'search').closeSearch();
    },

    openSearch() {
      get(this, 'search').openSearch();
    },

    updateQuery(searchText) {
      const search = get(this, 'search');

      setProperties(search, {
        searchQuery: searchText,
        searchPage: 1
      });
    },

    clearSearchType() {
      get(this, 'search').clearSearchType();
    }
  }
});
