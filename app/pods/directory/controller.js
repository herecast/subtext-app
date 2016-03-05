import Ember from 'ember';

const {
  get,
  set,
  inject,
  computed,
  isPresent,
  isEmpty
} = Ember;

export default Ember.Controller.extend({
  location: "",
  coords: null,
  category: null,
  query: "",

  toplevelCategories: computed('categories.[]', function() {
    return (get(this, 'categories') || []).filter(category => {
      return category.get('child_ids.length')  >= 1;
    });
  }),

  isReadyForSearch: computed('query', 'category', 'coords', function(){
    const query = get(this, 'query');
    const category = get(this, 'category');
    const coords = get(this, 'coords');

    return (query.length > 3 || isPresent(category)) && isPresent(coords);
  }),


  doSearch() {
    const category_id = get(this, 'category.id');
    const query = get(this, 'query');
    const lat = get(this, 'coords.lat');
    const lng = get(this, 'coords.lng');

    if(get(this, 'isReadyForSearch')) {
      this.transitionToRoute('directory.search', {queryParams: {
        lat: lat,
        lng: lng,
        query: query,
        category_id: category_id
      }});
    }
  },

  actions: {
    updateQuery(query) {
      this.setProperties({
        /* don't know what searchTerms is for */
        searchTerms: query,
        query: query,
        category: null
      });

      if (query.length <= 3) {
        this.transitionToRoute('directory');
      } else {
        this.doSearch();
      }
    },

    setCategory(category) {
      this.setProperties({
        category: category,
        query: null
      });
      this.doSearch();
    },

    removeTag(){},

    clearCategories() {
    },

    setParentCategory() {
    },

    setSubCategory() {
    },

    setLocation(name, coords) {
      this.setProperties({
        location: name,
        coords: coords
      });
      this.doSearch();
    }
  }
});
