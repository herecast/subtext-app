import Ember from 'ember';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
/* global dataLayer */

const { get, inject, computed } = Ember;

export default ModalInstance.extend({
  store: inject.service(),

  categories: computed(function() {
    const store = get(this, 'store');

    return store.findAll('market-category');
  }),

  categoryColumns: computed('categories.[]', function() {
    const categories = get(this, 'categories').sortBy('name');
    const columnLength = Math.floor(get(categories, 'length')/2);

    return {
      col1: categories.slice(0, columnLength),
      col2: categories.slice(columnLength, get(categories, 'length'))
    };
  }),

  actions: {
    trackCategoryClick(category) {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event'         : 'market-category-click',
          'category-name' : get(category, 'name'),
          'type'          : 'overlay-link'
        });
      }
    }
  }
});
