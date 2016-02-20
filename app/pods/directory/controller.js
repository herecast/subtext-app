import Ember from 'ember';

const {
  get,
  set,
  computed,
  inject,
  isEmpty,
  isPresent
} = Ember;

export default Ember.Controller.extend({
  geo: inject.service('geolocation'),
  location: computed.oneWay('geo.userLocation.human'),
  parentCategory: null,
  subCategory: null,
  searchTerms: null,

  toplevelCategories: computed('categories.[]', function() {
    return get(this, 'categories').filterBy('parents.length', 0);
  }),

  _removeParent() {
    this.setProperties({
      parentCategory: null,
      subCategory: null,
      searchTerms: null
    });
    this.transitionToRoute('directory');
  },

  _removeChild() {
    const parentCategory = get(this, 'parentCategory');

    this.setProperties({
      searchTerms: parentCategory.get('name'),
      subCategory: null
    });
    this.transitionToRoute('directory.search');
  },

  actions: {
    updateQuery(searchTerms) {
      const hasParentCategory = (get(this, 'parentCategory'));
      const categories = get(this, 'categories');
      const searchRegExp = new RegExp(`${searchTerms.toLowerCase().trim()}`);

      if (searchTerms.length <= 4) {
        return this.send('clearCategories', searchTerms);
      }

      const categoryMatches = categories.filter(category => {
        return (category.get('name').toLowerCase().match(searchRegExp) && !get(category, 'parents.length'));
      });

      if (isPresent(categoryMatches)) {
        return this.send('setParentCategory', categoryMatches[0], searchTerms);
      }

      if (isEmpty(categoryMatches)) {
        if (!hasParentCategory) {
          this.send('clearCategories', searchTerms);
        } else {
          this.send('clearCategories', searchTerms);
          this.transitionToRoute('directory.search.results');
        }
      } else if (searchTerms) {
        set(this, 'searchTerms', searchTerms);
        this.transitionToRoute('directory.search');
      }
    },

    removeTag(tagType) {
      return (tagType === 'parent') ? this._removeParent() : this._removeChild();
    },

    clearCategories(searchTerms) {
      this.setProperties({
        searchTerms: searchTerms,
        parentCategory: null,
        subCategory: null
      });
      this.transitionToRoute('directory');
    },

    setParentCategory(category, searchTerms) {
      this.setProperties({
        searchTerms: (typeof searchTerms === 'object') ? category.get('name') : searchTerms,
        parentCategory: category,
        subCategory: null
      });
      this.transitionToRoute('directory.search');
    },

    setSubCategory(category) {
      this.setProperties({
        searchTerms: category.get('name'),
        subCategory: category
      });
      this.transitionToRoute('directory.search.results');
    }
  }
});
