import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  queryParams: ['lat', 'lng', 'query', 'category_id'],
  category_id: null,
  query: null,
  results: computed.alias('model'),

  locations: computed('results.[]', function() {
    const results = get(this, 'results') || [];

    return results.map(location => {
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
