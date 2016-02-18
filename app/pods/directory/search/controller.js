import Ember from 'ember';

const { inject, computed, get } = Ember;
const { oneWay } = computed;

export default Ember.Controller.extend({
  directoryController: inject.controller('directory'),
  categories:     oneWay('directoryController.categories'),
  parentCategory: oneWay('directoryController.parentCategory'),
  subCategory:    oneWay('directoryController.subCategory'),
  results: computed.alias('model'),

  showResults: computed('parentCategory', 'subCategory', function() {
    const parentCategory = get(this, 'parentCategory');
    const subCategory = get(this, 'subCategory');

    return (parentCategory && subCategory);
  }),

  locations: computed('results.[]', 'results.@each', function() {
    const results = get(this, 'results');

    return results.map((location) => {
      return {
        coords: { 
          lat: parseFloat(location.get('coords.lat')),
          lng: parseFloat(location.get('coords.lng'))
        },
        title: location.get('name'),
        content: location.get('name')
      };
    });
  })
});
