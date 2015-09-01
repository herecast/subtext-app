import Ember from 'ember';
import EventFilter from '../../../mixins/controllers/event-filter';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(EventFilter, PaginatedFilter, {
  secondaryBackground: true,
  mixpanel: Ember.inject.service('mixpanel'),
  refreshParam: Ember.inject.service('refresh-param'),

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
      this.get('mixpanel').trackEvent('Event Search Reset');

      this.transitionToRoute('events', {
        queryParams: {
          category: this.get('defaultCategory'),
          location: this.get('defaultLocation'),
          query: this.get('defaultQuery'),
          date_start: this.get('defaultStart'),
          date_end: this.get('defaultEnd'),
          r: this.get('refreshParam.time')
        }
      });
    }
  }
});
