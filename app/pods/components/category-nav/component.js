import Ember from 'ember';
/* global dataLayer */

const {
  get,
  computed
} = Ember;

export default Ember.Component.extend({
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
      if ('openCategoriesModal' in this.attrs) {
        this.attrs.openCategoriesModal();
      }
    }
  }
});
