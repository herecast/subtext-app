import Ember from 'ember';

const {
  get,
  set,
  computed,
  isPresent,
  isEmpty
} = Ember;

export default Ember.Controller.extend({
  query: null,
  subcategory_id: null,
  lat: null,
  lng: null,
  location: "",
  parentCategory: null,
  subCategory: null,
  searchTerms: null,

  queryParams: ['query', 'subcategory_id', 'lat', 'lng'],

  toplevelCategories: computed('categories.[]', function() {
    return get(this, 'categories').filter(category => {
      return category.get('child_ids.length')  >= 1;
    });
  }),

  results: computed('lat', 'lng', 'query', 'subcategory_id', function() {
    const query = get(this, 'query');
    const lat = get(this, 'lat');
    const lng = get(this, 'lng');
    const subcategory_id = get(this, 'subcategory_id');

    if (isEmpty(query) && isEmpty(subcategory_id)) {
      return [];
    }

    let apiQuery = {
      query: query,
      category_id: subcategory_id,
      lat: lat,
      lng: lng
    };

    return this.store.query('business-profile', apiQuery);

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
      subcategory_id: null
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
      //set(this, 'results', this.store.query('business-profile', query));
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
        subCategory: null
      });
      this.transitionToRoute('directory');
    },

    setParentCategory(category, searchTerms) {
      this.setProperties({
        searchTerms: (typeof searchTerms === 'object') ? category.get('name') : searchTerms,
        parentCategory: category,
        subCategory: null,
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
        lat: get(this, 'lat'),
        lng: get(this, 'lng')
      };

      this.store.query('business-profile', query).then((results) => {
        if (isPresent(results)) {
          set(this, 'results', results);
          this.transitionToRoute('directory.search.results');
        } else {
          this.transitionToRoute('directory.search.no-results');
        }
      });
    },

    setLocation(name, coords) {
      this.setProperties({
        location: name,
        lat: coords.lat,
        lng: coords.lng
      });
    }
  }
});
