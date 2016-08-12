import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

const { computed } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'page', 'per_page'],

  page: 1,
  per_page: 24,

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

  /**
   * Note: Loading events on the controller instead of the route's model
   * This way we do not have to wait for it to resolve when loading an event detail page
   */
  //events: computed('category', 'query', 'date_start', 'date_end', 'location', 'page', 'per_page', function() {
  //  return this.store.query('event-instance', {
  //    category: get(this, 'category'),
  //    query: get(this, 'query'),
  //    date_start: get(this, 'date_start'),
  //    date_end: get(this, 'date_end'),
  //    location: get(this, 'location'),
  //    page: get(this, 'page'),
  //    per_page: get(this, 'per_page')
  //  });
  //}),

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
