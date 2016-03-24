import Ember from 'ember';
import jQuery from 'jquery';

const {
  inject,
  computed,
  get,
  set
} = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  searchController: inject.controller('directory.search'),
  results: computed.oneWay('searchController.results'),
  lat: computed.oneWay('searchController.lat'),
  lng: computed.oneWay('searchController.lng'),
  query: computed.oneWay('searchController.query'),
  sort_by: computed.alias('searchController.sort_by'),
  page: computed.alias('searchController.page'),
  per_page: computed.alias('searchController.per_page'),

  total: computed.alias('results.meta.total'),

  resultCount: computed('results.[]', function() {
    return get(this, 'results.length');
  }),

  firstResultNumber: computed('page', 'per_page', function(){
    const perPage = get(this, 'per_page');
    const page = get(this, 'page');

    return perPage * page - perPage + 1;
  }),

  lastResultNumber: computed('firstResultNumber', 'resultCount', function() {
    const first = get(this, 'firstResultNumber');
    const resultCount = get(this, 'resultCount');

    return first + resultCount - 1;
  }),

  scrollTop() {
    jQuery('body').animate({scrollTop: 0}, '100');
  },

  actions: {
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
