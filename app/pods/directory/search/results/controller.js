import Ember from 'ember';

const { computed, inject, get } = Ember;
const { oneWay } = computed;

export default Ember.Controller.extend({
  directoryController: inject.controller('directory'),
  categories:          oneWay('directoryController.categories'),
  parentCategory:      oneWay('directoryController.parentCategory'),
  subCategory:         oneWay('directoryController.subCategory'),
  results:             oneWay('directoryController.results'),

  directorySearchController: inject.controller('directory.search'),
  showResults:         oneWay('directorySearchController.showResults'),

  subCategories: computed('parentCategory', function() {
    const parentCategory = get(this, 'parentCategory');

    if (parentCategory) {
      const childIds = parentCategory.get('child_ids');

      if (childIds) {
        return this.store.peekAll('business-category').filter(category => {
          return childIds.includes(parseInt(category.get('id')));
        });
      }
    } else {
      return null;
    }
  }),

  actions: {
    setSubCategory(subCategory) {
      const directoryController = get(this, 'directoryController');

      directoryController.send('setSubCategory', subCategory);
    }
  }

});
