import Ember from 'ember';

const { computed, get, isEmpty } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  queryParams: ['lat', 'lng', 'query', 'category_id'],
  category_id: null,
  query: null,
  results: computed.alias('model'),
  locationsToRender: computed('selectedLocation', function() {
    const selectedLocation = get(this, 'selectedLocation');
    const locations = get(this, 'locations');

    return (selectedLocation) ? selectedLocation : locations;
  }),
  selectedResult: null,
  selectedLocation: computed('selectedResult', function() {
    const location = get(this, 'selectedResult');

    if (isEmpty(location)) {
      return null;
    }

    return [{
      coords: {
        lat: parseFloat(location.get('coords.lat')),
        lng: parseFloat(location.get('coords.lng'))
      },
      title: location.get('name'),
      content: `<h2>${location.get('name')}</h2>
                <div><i class="fa fa-map-marker"></i> ${location.get('fullAddress')}</div>
                <div><i class="fa fa-phone"></i> ${location.get('phone')}</div>
                <div><a href="${location.get('directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
    }];
  }),

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
