import Ember from 'ember';

const {
  get,
  set,
  computed,
  inject,
  isPresent
} = Ember;

export default Ember.Controller.extend({
  query: null,
  lat: null,
  lng: null,
  subcategory_id: null,

  geo: inject.service('geolocation'),
  location: computed.oneWay('geo.userLocation.human'),
  coords: computed.oneWay('geo.userLocation.coords'),
  parentCategory: null,
  subCategory: null,
  searchTerms: null,
  results: [],

  queryParams: ['query', 'subcategory_id', 'lat', 'lng'],

  toplevelCategories: computed('categories.[]', function() {
    return get(this, 'categories').filter(category => {
      return category.get('child_ids.length')  >= 1;
    });
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
      subCategory: null,
      subcategory_id: null,
      results: []
    });
    this.transitionToRoute('directory.search');
  },

  actions: {
    updateQuery(searchTerms) {
      const categories = get(this, 'categories');
      const re = new RegExp(`${searchTerms.trim()}`, 'i');

      // search term is too short
      if (searchTerms.length <= 4) {
        return this.send('clearCategories', searchTerms);
      }

      const categoryMatches = categories.filter(category => {
        return (category.get('name').match(re) && !get(category, 'parents.length'));
      });

      // has category match
      if (isPresent(categoryMatches)) {
        return this.send('setParentCategory', categoryMatches[0], searchTerms);
      }

      // do a normal query
      this.send('clearCategories', searchTerms);
      const query = {
        query: searchTerms,
        lat: get(this, 'coords.lat'),
        lng: get(this, 'coords.lng')
      };
      set(this, 'results', this.store.query('business-profile', query));
      set(this, 'query', searchTerms);
      set(this, 'subcategory_id', null);
      this.transitionToRoute('directory.search.results');
    },

    removeTag(tagType) {
      return (tagType === 'parent') ? this._removeParent() : this._removeChild();
    },

    clearCategories(searchTerms) {
      this.setProperties({
        searchTerms: searchTerms,
        parentCategory: null,
        query: null,
        subCategory: null,
        results: []
      });
      this.transitionToRoute('directory');
    },

    setParentCategory(category, searchTerms) {
      this.setProperties({
        searchTerms: (typeof searchTerms === 'object') ? category.get('name') : searchTerms,
        parentCategory: category,
        subCategory: null,
        results: [],
        query: null
      });
      this.transitionToRoute('directory.search');
    },

    setSubCategory(category) {
      this.setProperties({
        searchTerms: category.get('name'),
        subCategory: category,
        subcategory_id: category.get('id')
      });

      const query = {
        category_id: get(this, 'subCategory.id'),
        lat: get(this, 'coords.lat'),
        lng: get(this, 'coords.lng')
      };

      set(this, 'results', this.store.query('business-profile', query));
      this.transitionToRoute('directory.search.results');
    }
  }
});
