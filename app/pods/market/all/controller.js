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

  featureFlags: inject.service('feature-flags'),

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
      row1: cats.slice(0,4),
      row2: cats.slice(4,5)
    };
  }),

  trendingCategories: computed('categories.[]', function() {
    return get(this, 'categories').filterBy('trending', true);
  }),

  navCategories: computed.union('featuredCategories', 'trendingCategories'),

  recentPosts: computed('marketPosts', function() {
    return this.store.query('market-post', {
      has_image: true
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
  }],

  _trackMarketDigestSubscriptionClick() {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'market-digest-cta-subscribe-click'
      });
    }
  },

  actions: {
    subscribeToMarketDigest() {
      this._trackMarketDigestSubscriptionClick();

      if (get(this, 'session.isAuthenticated')) {
        // noop
      } else {
        this.transitionToRoute('register', {
          queryParams: {
            selectedDigest: get(this, 'featureFlags.market-index-subscribe-cta.options.digest-id')
          }
        });
      }
    },

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
        location: this.get('defaultLocation'),
        locationId: this.get('defaultLocationId'),
        query: this.get('defaultQuery')
      };

      this.send('resetFilter', 'market/all', params);
    }
  }
});
