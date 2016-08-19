import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import formatPhone from 'subtext-ui/utils/format-phone';

const { computed, get, set, $ } = Ember;

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

  businessCategories: computed(function () {
    return get(this, 'store').findAll('business-category');
  }),

  locations: computed('results.[]', function () {
    const results = get(this, 'results') || [];
    const isMobile = get(this, 'media.isMobile');

    return results.map(location => {
      let detailsUrl = this.get('target').generate('directory.show', location);

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

  scrollTop() {
    $(window).animate({scrollTop: 0}, '100');
  },

  _closeBusinessProfileForm() {
    set(this, 'newBusinessProfile', null);
    set(this, 'businessProfileFormIsVisible', false);
  },

  actions: {
    contactUs() {
      if ('contactUs' in this.attrs) {
        this.attrs.contactUs();
      }
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
    },

    changePage(page) {
      set(this, 'page', page);
      this.scrollTop();
    },

    changeSortBy(sort) {
      this.setProperties({
        page: 1,
        sort_by: sort
      });
      this.scrollTop();
    },

    changePerPage(per) {
      this.setProperties({
        page: 1,
        per_page: per
      });
      this.scrollTop();
    }
  }
});
