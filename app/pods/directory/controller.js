import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Controller.extend({
  geo: Ember.inject.service('geolocation'),
  location: Ember.computed.oneWay('geo.userLocation.human'),
  parentCategory: null,
  subCategory: null,
  searchTerms: null,

  actions: {
    manageTransition() {
      // business logic about when to
      // transition goes in here
      const searchTerms = get(this, 'searchTerms');

      if (searchTerms) {
        this.transitionToRoute('directory.search');
      } else {
        this.transitionToRoute('directory');
        set(this, 'parentCategory', null);
        set(this, 'subCategory', null);
      }
    },

    removeParent() {
      this.setProperties({
        parentCategory: null,
        subCategory: null,
        searchTerms: null
      });
      this.transitionToRoute('directory');
    },

    removeTag(tagType) {
      if (tagType === 'parent') {
        this.send('removeParent');
      } else if (tagType === 'child') {
        set(this, 'subCategory', null);
        this.transitionToRoute('directory');
      }
    },

    updateQuery(searchTerms) {
      // TODO search logic to go in here
      // s/b called 'updateSearch'?
      // see Gabriel's algorithm
      set(this, 'searchTerms', searchTerms);
      this.send('manageTransition');
    },

    setParentCategory(parentCategory) {
      set(this, 'parentCategory', parentCategory);
      set(this, 'searchTerms', parentCategory.name);
      this.transitionToRoute('directory.search');
    },

    setSubCategory(subCategory) {
      set(this, 'subCategory', subCategory);
      set(this, 'searchTerms', subCategory.name);
    }
  }
});
