import Ember from 'ember';

const { inject, computed, get } = Ember;
const { oneWay } = computed;

export default Ember.Controller.extend({
  directoryController: inject.controller('directory'),
  categories:     oneWay('directoryController.categories'),
  parentCategory: oneWay('directoryController.parentCategory'),
  subCategory:    oneWay('directoryController.subCategory'),
  results:        oneWay('directoryController.results'),

  showResults: computed('parentCategory', 'subCategory', function() {
    const parentCategory = get(this, 'parentCategory');
    const subCategory = get(this, 'subCategory');

    return (parentCategory && subCategory);
  }),

  locations: computed('results.[]', 'results.@each', function() {
    const results = get(this, 'results');

    return results.map((location) => {
      return {
        coords: { lat: location.coords.lat, lng: location.coords.lng },
        title: location.name,
        content: location.name
      };
    });
  })
});
