import Ember from 'ember';

const { computed, inject, get, isEmpty } = Ember;

function formatPhone(phone) {
  return phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

export default Ember.Controller.extend({
  secondaryBackground: true,
  directoryController: inject.controller('directory'),
  queryParams: ['lat', 'lng', 'query', 'category_id', 'sort_by', 'page', 'per_page'],
  category_id: null,
  query: null,
  sort_by: 'score_desc',
  page: 1,
  per_page: 25,
  results: computed.alias('model'),
  locationsToRender: computed('locations.[]','selectedLocation', function() {
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
                <div><a href="tel:+1${location.get('phone')}"><i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}</a></div>
                <div><a href="${location.get('directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
    }];
  }),

  locations: computed('results.[]', 'results.@each', function () {
    const results = get(this, 'results') || [];

    return results.map(location => {
      let detailsUrl = this.get('target').generate('directory.search.show', location);

      return {
        coords: {
          lat: parseFloat(location.get('coords.lat')),
          lng: parseFloat(location.get('coords.lng'))
        },
        title: location.get('name'),
        content: `<h2><a href="${detailsUrl}">${location.get('name')}</a></h2>
                  <div><i class="fa fa-map-marker"></i> ${location.get('fullAddress')}</div>
                  <div><a href="tel:+1${location.get('phone')}"><i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}</a></div>
                  <div><a href="${location.get('directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
      };
    });
  }),

  actions: {
    contactUs() {
      get(this, 'directoryController').send('contactUs');
    }
  }
});
