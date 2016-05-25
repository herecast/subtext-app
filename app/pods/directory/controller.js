import Ember from 'ember';

const {
  get,
  computed,
  isPresent
} = Ember;

export default Ember.Controller.extend({
  location: "",
  coords: null,
  category: null,
  query: "",
  isCalculatingLocation: false,

  canSearch: computed('query', 'category', 'coords', function() {
    const query = get(this, 'query') || '';
    const { category, coords } = this;

    return (query.length > 3 || isPresent(category)) && isPresent(coords);
  }),

  searchLocationPlaceholder: computed('isCalculatingLocation', function() {
    return get(this, 'isCalculatingLocation') ? "Calculating your location..." : "Where?";
  }),

  doSearch() {
    const category_id = get(this, 'category.id');
    const query = get(this, 'query');
    const { lat, lng } = get(this, 'coords');

    this.transitionToRoute('directory.search', { queryParams: {
      lat: lat,
      lng: lng,
      query: query,
      category_id: category_id,
      page: 1
    }});
  },

  actions: {
    updateQuery(query) {
      this.setProperties({
        searchTerms: query,
        query: query,
        category: null
      });

      if (query.length <= 3) {
        this.transitionToRoute('directory');
      } else {
        if (get(this, 'canSearch')) {
          this.doSearch();
        }
      }
    },

    setCategory(category) {
      this.setProperties({
        category: category,
        query: null
      });

      if (get(this, 'canSearch')) {
        this.doSearch();
      }
    },

    setLocation(name, coords) {
      this.setProperties({
        location: name,
        coords: coords
      });

      if (get(this, 'canSearch')) {
        this.doSearch();
      }
    },

    contactUs() {
      let intercomButton = Ember.$('.intercom-launcher-button');
      if(intercomButton.length > 0){
        intercomButton[0].click();
      }else{
        window.location.href = "mailto:dailyuv@subtext.org?subject=My Business on dailyUV";
      }
    }
  }
});
