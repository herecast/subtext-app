import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const { computed, get, inject } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'page', 'per_page'],

  page: 1,
  per_page: 24,
  total: null,

  defaultCategory: 'Everything',
  defaultQuery: null,
  defaultLocation: 'All Communities',
  defaultStart: null,
  defaultEnd: null,

  category: 'Everything',
  location: 'All Communities',
  query: null,
  date_start: null,
  date_end: null,

  // Used to make the variable names more JSish and still let us pass the
  // right params to the API.
  startDate: null,
  stopDate: null,

  showNextPage: computed('model.[]', 'page', function() {
    const page        = get(this, 'page'),
          pageSize    = get(this, 'per_page'),
          total       = get(this, 'total');

    return total > page * pageSize;
  }),

  modals: inject.service(),

  showReset: computed('category', 'query', 'date_start', 'date_end', 'location', function() {
    const isDefaultCategory = this.get('defaultCategory') === this.get('category');
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');
    const isDefaultStart = this.get('defaultStart') === this.get('startDate');
    const isDefaultEnd = this.get('defaultEnd') === this.get('stopDate');

    return !isDefaultCategory || !isDefaultLocation || !isDefaultQuery ||
      !isDefaultStart || !isDefaultEnd;
  }),

  actions: {
    openCalendarWidget() {
      get(this, 'modals').showModal('modals/date-picker').then((date) => {
        this.send('jumpToDate', date);
      });
    },

    resetFilters() {
      const params = {
        category: this.get('defaultCategory'),
        location: this.get('defaultLocation'),
        query: this.get('defaultQuery'),
        date_start: this.get('defaultStart'),
        date_end: this.get('defaultEnd')
      };

      this.send('resetFilter', 'events/all', params);
    },

    jumpToDate(targetDate) {
      const params = {
        category   : get(this, 'defaultCategory'),
        location   : get(this, 'defaultLocation'),
        query      : get(this, 'defaultQuery'),
        date_start : targetDate || null,
        date_end   : get(this, 'defaultEnd')
      };

      this.send('updateFilter', params);
    }
  }
});
