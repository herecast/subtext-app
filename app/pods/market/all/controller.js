import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

/* global dataLayer */

const {
  set,
  get,
  computed,
  inject
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  flat: false,

  page: 1,
  per_page: 24,

  queryParams: ['query', 'location', 'locationId', 'page', 'per_page', 'flat'],

  defaultQuery: '',
  defaultLocation: 'All Communities',
  defaultLocationId: null,

  query: '',
  location: 'All Communities',
  locationId: null,

  modals: inject.service(),

  showReset: computed('query', 'location', function() {
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');

    return !isDefaultLocation || !isDefaultQuery;
  }),

  categories: computed(function() {
    return this.store.findAll('market-category');
  }),

  regularCategories: computed('categories.[]', function() {
    return get(this, 'categories').filterBy('featured', false);
  }),

  featuredCategories: computed('categories.[]', function() {
    return get(this, 'categories').filterBy('featured', true);
  }),

  featuredCategoryRows: computed('featuredCategories.[]', function() {
    const cats = get(this, 'featuredCategories');

    return {
      row1: cats.slice(0,3),
      row2: cats.slice(3,6)
    };
  }),

  trendingCategories: computed('categories.[]', function() {
    return get(this, 'categories').filterBy('trending', true);
  }),

  navCategories: computed.union('featuredCategories', 'trendingCategories'),

  actions: {
    updateQuery(q) {
      if(q.length > 2) {
        set(this, 'query', q);

        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            'event' : 'market-channel-search',
            'query' : q
          });
        }
      } else {
        set(this, 'query', "");
      }
      set(this, 'page', 1);
    },

    trackCategoryMoreClick() {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event' : 'market-categories-more-click',
          'type'  : 'featured-card'
        });
      }
    },

    trackCategoryClick(category, type) {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event'         : 'market-category-click',
          'category-name' : get(category, 'name'),
          'type'          : type
        });
      }
    },

    trackCardClick() {
      const type = (get(this, 'flat')) ? 'new-market-card' : 'search-result';

      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event' : 'market-post-click',
          'query' : get(this, 'query'),
          type
        });
      }
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

      this.send('resetFilter', 'market/all', params);
    }
  }
});
