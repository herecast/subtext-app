import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend({
  userLocation: inject.service(),
  selectedLocation: computed.readOnly('userLocation.activeLocation'),
  tracking: inject.service(),

  queryParams: ['radius', 'category', 'query', 'date_start', 'days_ahead', 'organization'],

  radius: 10,
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
    },

    goToFeed() {
      this.transitionToRoute("feed", {
        queryParams: {
          type: ""
        }
      });
    },

    changeRadius(radius) {
      get(this, 'tracking').changeSearchRadius(radius, {
        channel: get(this, 'channel'),
        oldRadius: get(this, 'radius')
      });

      this.setProperties({
        days_ahead: 1,
        radius: radius
      });
    },

    chooseLocation(location) {
      const userLocation = get(this, 'userLocation');

      get(this, 'tracking').push({
        event: "ChooseLocation",
        location_id: get(userLocation, 'location.id'),
        new_location_name: get(location, 'name'),
        new_location_id: get(location, 'id')
      });

      this.transitionToRoute('location.events', location, {
        queryParams: {
          days_ahead: 1
        }
      });
    }
  }
});
