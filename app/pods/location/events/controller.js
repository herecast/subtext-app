import Ember from 'ember';
import moment from 'moment';
import LocationMixin from 'subtext-ui/mixins/controllers/location';

const {
  computed,
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend(LocationMixin, {
  channel: "events",
  userLocation: inject.service(),
  selectedLocation: computed.readOnly('userLocation.activeLocation'),
  queryParams: ['category', 'query', 'date_start', 'days_ahead', 'organization'],

  category: null,
  location: 'All Communities',
  query: null,
  organization: null,
  date_start: moment().format('YYYY-MM-DD'),
  days_ahead: 1,

  defaultCategory: null,
  defaultQuery: null,
  defaultOrganization: null,
  defaultStart: moment().format('YYYY-MM-DD'),
  defaultDaysAhead: 1,

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  },

  activeCategories: computed('category', function() {
    return get(this, 'category') ? get(this, 'category').split(',') : [];
  }),

  isGroupedByDay: computed.empty('category'),

  formattedThroughDate: computed('date_start', 'days_ahead', function() {
    const daysAhead = get(this, 'days_ahead');

    if (daysAhead <= 1) {
      return null;
    }

    return moment(get(this, 'date_start')).add((get(this, 'days_ahead') - 1), 'day').format('dddd, MMMM D');
  }),

  goToDay(day) {
    this.setProperties({
      date_start: day,
      days_ahead: 1
    });
  },

  setDaysAhead(days) {
    this.setProperties({
      date_start: get(this, 'date_start'),
      days_ahead: days
    });
  },

  goToCategories(categories) {
    this.setProperties({
      category: categories || null
    });
  },


  actions: {
    loadNextDayOrWeek() {
      const daysToAdd = get(this, 'isGroupedByDay') ? 1 : 7;

      this.setDaysAhead(get(this, 'days_ahead') + daysToAdd);
    },

    jumpToDay(day) {
      this.goToDay(moment(day).format('YYYY-MM-DD'));
    },

    addCategory(category) {
      let activeCategoryArray = get(this, 'category') ? get(this, 'category').split(',') : [];

      if (activeCategoryArray.indexOf(category) < 0) {
        activeCategoryArray.push(category);
      }

      this.goToCategories(activeCategoryArray.join(','));
    },

    removeCategory(category) {
      let activeCategoryArray = get(this, 'category') ? get(this, 'category').split(',') : [];

      if (activeCategoryArray.indexOf(category) >= 0) {
        activeCategoryArray.splice(activeCategoryArray.indexOf(category), 1);
      }

      this.goToCategories(activeCategoryArray.join(','));
    },

    clearCategories() {
      this.goToCategories(null);
      this.setDaysAhead(1);
    }
  }
});
