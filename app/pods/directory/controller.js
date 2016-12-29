import Ember from 'ember';

const {
  get,
  set,
  computed,
  isPresent,
  isEmpty,
  inject,
  $
} = Ember;

export default Ember.Controller.extend({
  geo: inject.service('geolocation'),
  fastboot: inject.service(),

  queryParams: ['location','lat', 'lng', 'query', 'category_id', 'sort_by', 'page', 'per_page'],

  lat: null,
  lng: null,
  query: '',
  category_id: null,
  sort_by: 'score_desc',
  page: 1,
  per_page: 25,

  location: "",
  isCalculatingLocation: false,
  total: null,
  isLoading: false,
  businesses: null,

  intercom: inject.service(),

  

  canSearch: computed('query', 'category_id', 'lat', 'lng', function() {
    const query = get(this, 'query') || '';
    const category_id = get(this, 'category_id');
    const lat = get(this, 'lat');
    const lng = get(this, 'lng');

    return (query.length > 3 || isPresent(category_id)) && isPresent(lat) && isPresent(lng);
  }),

  searchLocationPlaceholder: computed('isCalculatingLocation', function() {
    return get(this, 'isCalculatingLocation') ? "Calculating your location..." : "Where?";
  }),

  searchBusinesses: computed('lat', 'lng', 'query', 'category_id', 'sort_by', 'page', 'per_page', function() {
    set(this, 'isLoading', true);

    const category_id = get(this, 'category_id');
    const query = get(this, 'query');

    if (isEmpty(query) && isEmpty(category_id)) {
      set(this, 'isLoading', false);
      return [];
    }

    let apiQuery = {
      query: query,
      category_id: category_id,
      lat: get(this, 'lat'),
      lng: get(this, 'lng'),
      sort_by: get(this, 'sort_by'),
      page: get(this, 'page'),
      per_page: get(this, 'per_page')
    };

    const promise = this.store.query('business-profile', apiQuery);

    promise.then(results => {
      this.setProperties({
        total: get(results, 'meta.total'),
        businesses: results,
        isLoading: false
      });

      return results;
    });

    if(get(this, 'fastboot.isFastBoot')) {
      get(this, 'fastboot').deferRendering(promise);
    }

    return promise;
  }),

  category: computed('category_id', 'categories.[]', function() {
    const categoryId = get(this, 'category_id');
    return isPresent(categoryId) ? get(this, 'categories').findBy('id', categoryId) : null;
  }),

  coords: null,

  scrollTop() {
    $(window).scrollTop(0);
  },

  actions: {
    updateQuery(query) {
      this.setProperties({
        searchTerms: query,
        query: query,
        category_id: null
      });
    },

    setCategory(category) {
      this.setProperties({
        category_id: get(category, 'id'),
        query: ''
      });
    },

    setLocation(name, coords) {
      this.setProperties({
        location: name,
        lat: get(coords, 'lat'),
        lng: get(coords, 'lng')
      });
    },

    contactUs() {
      get(this, 'intercom').contactUs("My Business on dailyUV");
    },

    changePage(page) {
      set(this, 'page', page);
      this.scrollTop();
    },

    changeSortBy(sort) {
      this.setProperties({
        page: 1,
        sort_by: sort
      });
      this.scrollTop();
    },

    changePerPage(per) {
      this.setProperties({
        page: 1,
        per_page: per
      });
      this.scrollTop();
    }
  }
});
