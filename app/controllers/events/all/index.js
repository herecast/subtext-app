import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';
import Dates from 'subtext-ui/lib/dates';

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  queryParams: ['category', 'query', 'date_start', 'date_end', 'location',
    'page', 'per_page', 'event_layout'
  ],

  page: 1,
  per_page: 24,
  event_layout: 'grid', // list or grid

  defaultCategory: 'Everything',

  defaultQuery: function() {
    return null;
  }.property(),

  defaultLocation: 'All Communities',

  defaultStart: Dates.startOfWeek(),
  defaultEnd: Dates.endOfWeek(),

  category: Ember.computed.oneWay('defaultCategory'),
  location: Ember.computed.oneWay('defaultLocation'),
  query: Ember.computed.oneWay('defaultQuery'),
  date_start: Ember.computed.oneWay('defaultStart'),
  date_end: Ember.computed.oneWay('defaultEnd'),

  // Used to make the variable names more JSish and still let us pass the
  // right params to the API.
  startDate: Ember.computed.alias('date_start'),
  stopDate: Ember.computed.alias('date_end'),

  showReset: function() {
    const isDefaultCategory = this.get('defaultCategory') === this.get('category');
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');
    const isDefaultStart = this.get('defaultStart') === this.get('startDate');
    const isDefaultEnd = this.get('defaultEnd') === this.get('stopDate');

    return !isDefaultCategory || !isDefaultLocation || !isDefaultQuery ||
      !isDefaultStart || !isDefaultEnd;
  }.property('category', 'query', 'date_start', 'date_end', 'location'),

  actions: {
    resetFilters() {

      const params = {
        category: this.get('defaultCategory'),
        location: this.get('defaultLocation'),
        query: this.get('defaultQuery'),
        date_start: this.get('defaultStart'),
        date_end: this.get('defaultEnd')
      };

      this.send('resetFilter', 'events/all', params);
    }
  }
});
