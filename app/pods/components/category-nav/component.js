import Ember from 'ember';
/* global dataLayer */

const {
  get,
  computed,
  inject
} = Ember;

export default Ember.Component.extend({
  userLocation: inject.service(),
  locationId: computed.oneWay('userLocation.locationId'),

  displayCategories: computed('categories.[]', function() {
    return get(this, 'categories').slice(0, 7);
  }),

  actions: {
    trackCategoryMoreClick() {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event' : 'market-categories-more-click',
          'type'  : 'category-nav'
        });
      }
    },
    trackCreateButtonClick() {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event' : 'market-create-button-click'
        });
      }
    },

    trackCategoryClick(category) {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event'         : 'market-category-click',
          'type'          : 'category-nav',
          'category-name' : get(category, 'name')
        });
      }
    },

    openCategoriesModal() {
      const openCategoriesModal = get(this, 'openCategoriesModal');
      if (openCategoriesModal) {
        openCategoriesModal();
      }
    }
  }
});
