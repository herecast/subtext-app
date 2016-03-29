import Ember from 'ember';
import Validation from '../../../mixins/components/validation';

const { computed, inject, get, set, isEmpty } = Ember;

function formatPhone(phone) {
  return phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

export default Ember.Controller.extend(Validation, {
  newBusinessProfile: null,
  businessProfileFormIsVisible: false,

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
    const isMobile = get(this, 'media.isMobile');

    if (isEmpty(location)) {
      return null;
    }

    const phone = (isMobile) ?
      `<a href="tel:+1${location.get('phone')}">`+
      `<i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}`+
      `</a>` : `<i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}`;

    return [{
      coords: {
        lat: parseFloat(location.get('coords.lat')),
        lng: parseFloat(location.get('coords.lng'))
      },
      title: location.get('name'),
      content: `<h2>${location.get('name')}</h2>
      <div><i class="fa fa-map-marker"></i> ${location.get('fullAddress')}</div>
      <div>${phone}</div><div><a href="${location.get('directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
    }];
  }),

  businessCategories: computed(function () {
    return get(this, 'store').find('business-category');
  }),

  locations: computed('results.[]', 'results.@each', function () {
    const results = get(this, 'results') || [];
    const isMobile = get(this, 'media.isMobile');

    return results.map(location => {
      let detailsUrl = this.get('target').generate('directory.search.show', location);

      const phone = (isMobile) ?
      `<a href="tel:+1${location.get('phone')}">`+
      `<i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}`+
      `</a>` : `<i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}`;

      return {
        coords: {
          lat: parseFloat(location.get('coords.lat')),
          lng: parseFloat(location.get('coords.lng'))
        },
        title: location.get('name'),
        content: `<h2><a href="${detailsUrl}">${location.get('name')}</a></h2>
                  <div><i class="fa fa-map-marker"></i> ${location.get('fullAddress')}</div>
                  <div>${phone}</div>
                  <div><a href="${location.get('directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
      };
    });
  }),

  _closeBusinessProfileForm() {
    set(this, 'newBusinessProfile', null);
    set(this, 'businessProfileFormIsVisible', false);
  },

  actions: {
    contactUs() {
      get(this, 'directoryController').send('contactUs');
    },

    showBusinessProfileForm() {
      let newBusinessProfile = get(this, 'store').createRecord('business-profile');
      set(this, 'newBusinessProfile', newBusinessProfile);
      set(this, 'businessProfileFormIsVisible', true);
    },

    cancelBusinessProfileForm() {
      if (get(this, 'newBusinessProfile.hasDirtyAttributes')) {
        if (confirm('Are you sure you want to discard your changes without saving?')) {
          get(this, 'newBusinessProfile').rollbackAttributes();
          this._closeBusinessProfileForm();
        }
      }
    },

    savedBusinessProfileForm() {
      this._closeBusinessProfileForm();
    }
  }
});
