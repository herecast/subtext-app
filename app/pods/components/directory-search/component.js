import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import formatPhone from 'subtext-ui/utils/format-phone';

const { computed, get } = Ember;

export default Ember.Component.extend(Validation, {
  newBusinessProfile: null,
  businessProfileFormIsVisible: false,

  secondaryBackground: true,

  category_id: null,
  query: null,
  sort_by: 'score_desc',
  page: 1,
  per_page: 25,

  total: null,
  results: computed.alias('model'),

  locations: computed('results.[]', function () {
    const results = get(this, 'results') || [];

    return results.map(location => {
      let detailsUrl = this.get('target').generate('directory.show', location);

      const phone = `<a href="tel:+1${location.get('phone')}" class="visible-xs-inline">`+
      `<i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}`+
      `</a><span class="hidden-xs"><i class="fa fa-phone"></i> ${formatPhone(location.get('phone'))}</span>`;

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

  resultCount: computed('results.[]', function() {
    return get(this, 'results.length');
  }),

  firstResultNumber: computed('page', 'per_page', function(){
    const perPage = get(this, 'per_page');
    const page = get(this, 'page');

    return perPage * page - perPage + 1;
  }),

  lastResultNumber: computed('firstResultNumber', 'resultCount', function() {
    const first = get(this, 'firstResultNumber');
    const resultCount = get(this, 'resultCount');

    return first + resultCount - 1;
  }),

  actions: {
    contactUs() {
      const contactUs = get(this, 'contactUs');
      if (contactUs) {
        contactUs();
      }
    },

    toggleBusinessProfileForm() {
      this.toggleProperty('businessProfileFormIsVisible');
    }
  }
});
