import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  queryParams: ['lat', 'lng', 'query', 'category_id'],
  category_id: null,
  query: null,
  results: computed.alias('model'),

  locations: computed('results.[]', 'results.@each', function () {
    const results = get(this, 'results') || [];

    return results.map(location => {
      return {
        coords: {
          lat: parseFloat(location.get('coords.lat')),
          lng: parseFloat(location.get('coords.lng'))
        },
        title: location.get('name'),
        content: `<h2>${location.get('name')}</h2>
                  <div><i class="fa fa-map-marker"></i> ${location.get('fullAddress')}</div>
                  <div><i class="fa fa-phone"></i> ${location.get('phone')}</div>
                  <div><a href="${location.get('directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
      };
    });
  })
});
