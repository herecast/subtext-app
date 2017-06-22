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
  userLocation: inject.service('user-location'),
  locationId: computed.oneWay('userLocation.locationId'),

  secondaryBackground: true,

  featureFlags: inject.service('feature-flags'),

  flat: false,

  page: 1,
  per_page: 24,

  queryParams: ['query', 'page', 'per_page', 'flat'],

  defaultQuery: '',

  query: '',

  modals: inject.service(),

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  },

  showReset: computed('query', function() {
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');

    return !isDefaultQuery;
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
      row1: cats.slice(0,4),
      row2: cats.slice(4,5)
    };
  }),

  trendingCategories: computed('categories.[]', function() {
    return get(this, 'categories').filterBy('trending', true);
  }),

  navCategories: computed.union('featuredCategories', 'trendingCategories'),

  recentPosts: computed('userLocation.locationId', function() {
    return get(this, "userLocation.location").then(location => {
      return this.store.query('market-post', {
        location_id: get(location, 'id'),
        has_image: true
      });
    });
  }),

  testimonials: [{
    name: 'Jackie',
    img: 'https://subtext-misc.s3.amazonaws.com/sierra-nevada/user-testimonial--jackie-pierce.jpg',
    town: 'Hartland, VT',
    content: "My Husband and I own a small business and are always looking for inexpensive ways to find local help. We posted in the dailyUV market and were able to create a custom listing for our job position that we could then share on Facebook and the local lists. We hired someone in 4 days!"
  },{
    name: 'Michelle',
    img: 'https://subtext-misc.s3.amazonaws.com/sierra-nevada/user-testimonial--michelle.jpg',
    town: 'Quechee, VT',
    content: "The Quechee Inn at Marshland Farm runs weekly promotions in the market which is a great source for us to reach our local customers.  I am able to track how many views our post has seen which is valuable information. The staff has been great at teaching me how to use the site to work for our business."
  },{
    name: 'Dave C.',
    img: 'https://subtext-misc.s3.amazonaws.com/sierra-nevada/dave-c.jpg',
    town: 'Lyme, NH',
    content: "The Market is my go-to place to buy and sell all kinds of things. I know my items and services will get seen, and I'll have any easy online link to share that people know and trust. DailyUV's Market is easy to use and fun to browse!"
  }],

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

    trackCreateButtonClick() {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event' : 'market-create-button-click-jumbo',
          'type'  : 'index-jumbotron'
        });
      }
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

    trackCardClick(cardType) {
      let type;

      if (cardType) {
        type = cardType;
      } else {
        type = (get(this, 'flat')) ? 'new-market-card' : 'search-result';
      }

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
        query: this.get('defaultQuery')
      };

      this.send('resetFilter', 'location.market', params);
    }
  }
});
