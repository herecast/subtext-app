import Ember from 'ember';

const {
  get,
  computed,
  inject
} = Ember;

export default Ember.Component.extend({
  userLocation: inject.service(),
  tracking: inject.service(),
  locationId: computed.oneWay('userLocation.locationId'),

  displayCategories: computed('categories.[]', function() {
    return get(this, 'categories').slice(0, 7);
  }),

  actions: {
    trackCategoryMoreClick() {
      get(this, 'tracking').push({
        'event' : 'market-categories-more-click',
        'type'  : 'category-nav'
      });
    },
    trackCreateButtonClick() {
      get(this, 'tracking').push({
        'event' : 'market-create-button-click'
      });
    },

    trackCategoryClick(category) {
      get(this, 'tracking').push({
        'event'         : 'market-category-click',
        'type'          : 'category-nav',
        'category-name' : get(category, 'name')
      });
    },

    openCategoriesModal() {
      const openCategoriesModal = get(this, 'openCategoriesModal');
      if (openCategoriesModal) {
        openCategoriesModal();
      }
    }
  }
});
