import Ember from 'ember';

const {
  computed,
  inject,
  get,
  set,
  setProperties,
  isBlank,
  isPresent
  } = Ember;

const defaultSearchParams = {
  // Params used by all search categories
  searchType: null,
  searchQuery: '',
  searchPage: 1,
  searchPerPage: 5,

  // Params used by Market, Events and News search categories
  searchLocation: 'All Communities',
  searchLocationId: null,
  searchDateStart: null,
  searchDateEnd: null,

  // Params used by News search category
  searchOrganization: 'Everyone',

  // Params used by Events search category
  searchCategory: null
};

export default Ember.Service.extend(defaultSearchParams, {
  store: inject.service(),

  // Disabled automatically setting search type based on channel
  //currentController: inject.service(),
  //currentChannel: computed.alias('currentController.currentChannel'),

  showSearch: false,
  showFiltersMenu: false,
  previousSearch: {},
  defaultSearchParams: defaultSearchParams,

  searchEventsTotal: 0,
  searchNewsTotal: 0,
  searchTalkTotal: 0,
  searchMarketTotal: 0,

  hasFilter: computed(
    'searchLocationId',
    'searchLocation',
    'searchDateEnd',
    'searchDateStart',
    'searchOrganization',
    'searchCategory',
    function() {
      let searchParams = Ember.copy(defaultSearchParams, true);
      delete searchParams.searchQuery;
      delete searchParams.searchType;
      delete searchParams.searchPage;
      delete searchParams.searchPerPage;

      const searchProps = Object.keys(searchParams);

      return searchProps.any(prop => {
        return get(this, prop) !== searchParams[prop];
      });
  }),

  searchNews: computed(
    'searchType',
    'searchQuery',
    'searchPage',
    'searchPerPage',
    'searchLocationId',
    'searchDateEnd',
    'searchOrganization',
    function() {
      const searchType = get(this, 'searchType');
      if (isBlank(searchType) || searchType === 'news') {
        const result = get(this, 'store').query('news', {
          query: get(this, 'searchQuery'),
          location: get(this, 'searchLocation'),
          location_id: get(this, 'searchLocationId'),
          organization: get(this, 'searchOrganization'),
          page: get(this, 'searchPage'),
          per_page: get(this, 'searchPerPage')
        });

        result.then(response => {
          set(this, 'searchNewsTotal', response.meta.total || 0);
        });

        return result;
      } else {
        return [];
      }
    }),

  searchEvents: computed(
    'searchType',
    'searchQuery',
    'searchPage',
    'searchPerPage',
    'searchDateStart',
    'searchDateEnd',
    'searchCategory',
    'searchLocation',
    function() {
      const searchType = get(this, 'searchType');
      if (isBlank(searchType) || searchType === 'events') {
        const result = get(this, 'store').query('event-instance', {
          category: get(this, 'searchCategory'),
          query: get(this, 'searchQuery'),
          date_start: get(this, 'searchDateStart'),
          date_end: get(this, 'searchDateEnd'),
          location: get(this, 'searchLocation'),
          page: get(this, 'searchPage'),
          per_page: get(this, 'searchPerPage')
        });

        result.then(response => {
          set(this, 'searchEventsTotal', response.meta.total || 0);
        });

        return result;
      } else {
        return [];
      }
    }),

  searchTalk: computed(
    'searchType',
    'searchQuery',
    'searchPage',
    'searchPerPage',
    'searchDateStart',
    'searchDateEnd',
    function() {
      const searchType = get(this, 'searchType');
      if (isBlank(searchType) || searchType === 'talk') {
        const result = get(this, 'store').query('talk', {
          query: get(this, 'searchQuery'),
          date_start: get(this, 'searchDateStart'),
          date_end: get(this, 'searchDateEnd'),
          page: get(this, 'searchPage'),
          per_page: get(this, 'searchPerPage')
        });

        result.then(response => {
          set(this, 'searchTalkTotal', response.meta.total || 0);
        });

        return result;
      } else {
        return [];
      }
    }),

  searchMarket: computed(
    'searchType',
    'searchQuery',
    'searchPage',
    'searchPerPage',
    'searchLocation',
    'searchLocationId',
    'searchDateStart',
    'searchDateEnd',
    function() {
      const searchType = get(this, 'searchType');
      if (isBlank(searchType) || searchType === 'market') {
        const result = get(this, 'store').query('market-post', {
          query: get(this, 'searchQuery'),
          date_start: get(this, 'searchDateStart'),
          date_end: get(this, 'searchDateEnd'),
          location: get(this, 'searchLocation'),
          location_id: get(this, 'searchLocationId'),
          page: get(this, 'searchPage'),
          per_page: get(this, 'searchPerPage')
        });

        result.then(response => {
          set(this, 'searchMarketTotal', response.meta.total || 0);
        });

        return result;
      } else {
        return [];
      }
    }),

  saveSearchParams() {
    // Store previous search params so we can restore them later
    setProperties(get(this, 'previousSearch'), {
      searchType: get(this, 'searchType'),
      searchQuery: get(this, 'searchQuery'),
      searchPage: get(this, 'searchPage'),
      searchPerPage: get(this, 'searchPerPage'),
      searchDateStart: get(this, 'searchDateStart'),
      searchDateEnd: get(this, 'searchDateEnd'),
      searchLocation: get(this, 'searchLocation'),
      searchLocationId: get(this, 'searchLocationId'),
      searchOrganization: get(this, 'searchOrganization'),
      searchCategory: get(this, 'searchCategory')
    });
  },

  restoreSearchParams() {
    // Set search params to previous values if present
    const previousSearch = get(this, 'previousSearch');

    if (isPresent(previousSearch)) {
      setProperties(this, previousSearch);
    }
  },

  clearSearchParams() {
    // Reset search params to default values
    setProperties(this, defaultSearchParams);
  },

  clearSearchType() {
    setProperties(this, {
      searchType: defaultSearchParams.searchType,
      searchPerPage: defaultSearchParams.searchPerPage
    });
  },

  closeFiltersMenu() {
    set(this, 'showFiltersMenu', false);
  },

  openFiltersMenu() {
    set(this, 'showFiltersMenu', true);
  },

  closeSearch() {
    set(this, 'showSearch', false);
    this.saveSearchParams();
    this.clearSearchParams();
  },

  openSearch() {
    this.restoreSearchParams();

    // Disabled automatically setting search type based on channel
    // Note: to re-enable this, uncomment the currentChannel service & alias above

    //const knownSearchTypes = ['news', 'market', 'events', 'talk'];
    //const currentChannel = get(this, 'currentChannel');
    //const isSearchable = knownSearchTypes.contains(currentChannel);
    //if (isSearchable && isBlank(get(this, 'searchType'))) {
    //  set(this, 'searchType', currentChannel);
    //}

    set(this, 'showSearch', true);
  }

});
