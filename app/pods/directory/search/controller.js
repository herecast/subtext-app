import Ember from 'ember';

const { inject, computed, get } = Ember;
const { oneWay } = computed;

export default Ember.Controller.extend({
  directoryController: inject.controller('directory'),
  queryParams: ['lat', 'lng', 'query', 'category_id'],
  category_id: null,
  query: null,
  results: computed.alias('model'),

  showResults: computed.gte('results.length', 1),

  locations: computed('results.[]', function() {
    const results = get(this, 'results') || [];

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
