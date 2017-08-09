import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';
import LocationMixin from 'subtext-ui/mixins/controllers/location';

const {
  set,
  get,
  inject
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, LocationMixin, {
  channel: "market",

  tracking: inject.service(),
  userLocation: inject.service('user-location'),

  secondaryBackground: true,

  featureFlags: inject.service('feature-flags'),

  page: 1,
  per_page: 24,

  queryParams: ['page', 'per_page'],

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', () => {
      set(this, 'scrollPosition', 0);
    });
  },

  actions: {
    trackCreateButtonClick() {
      get(this, 'tracking').push({
        'event': 'market-create-button-click-jumbo',
        'type': 'index-jumbotron'
      });
    },

    trackCardClick(cardType) {
      let type;

      if (cardType) {
        type = cardType;
      } else {
        type = (get(this, 'flat')) ? 'new-market-card' : 'search-result';
      }

      get(this, 'tracking').push({
        'event': 'market-post-click',
        'query': get(this, 'query'),
        type: 'new-market-card'
      });
    }
  }
});
