import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const { computed, inject, get } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  name: null,
  page: 1,
  per_page: 24,

  tracking: inject.service(),
  marketController: inject.controller('location.market.index'),
  categories:    computed.alias('marketController.navCategories'),
  allCategories: computed.alias('marketController.categories'),

  queryParams: ['query', 'location', 'locationId', 'page', 'per_page', 'flat', 'name', 'query_modifier'],

  defaultQuery: '',
  defaultLocation: 'All Communities',
  defaultLocationId: null,

  query: '',
  location: 'All Communities',
  locationId: null,

  modals: inject.service(),

  showPrevPage: computed.gt('page', 1),
  showNextPage: computed('posts.[]', 'page', function() {
    return get(this, 'posts.length') === get(this, 'per_page');
  }),

  actions: {
    trackCardClick() {
      get(this, 'tracking').push({
        'event'    : 'market-post-click',
        'category' : get(this, 'cat.name'),
        'has-category-banner-image': get(this, 'cat.banner') ? true : false,
        'type': 'new-market-card'
      });
    },

    openCategoriesModal() {
      get(this, 'modals').showModal('modals/market-categories');
    },

    resetFilters() {
      const params = {
        location: this.get('defaultLocation'),
        locationId: this.get('defaultLocationId'),
        query: this.get('defaultQuery')
      };

      this.send('resetFilter', 'location.market.index', params);
    }
  }
});
