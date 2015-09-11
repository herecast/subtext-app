import Ember from 'ember';
import Dates from '../lib/dates';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  mixpanel: Ember.inject.service('mixpanel'),
  intercom: Ember.inject.service('intercom'),

  actions: {
    submit() {
      const filterParams = this.getProperties('category', 'query', 'location');
      const startDate = this.get('startDate');
      const stopDate = this.get('stopDate');

      filterParams.date_start = startDate;
      filterParams.date_end = stopDate;

      this.get('mixpanel').trackEvent('Event Search', {
        'Category': this.get('category'),
        'Query': this.get('query'),
        'Location': this.get('location'),
        'Date Summary': Dates.dateSummary(startDate, stopDate)
      });

      this.get('intercom').trackEvent('searched-event', {
        category: this.get('category'),
        query: this.get('query'),
        location: this.get('location'),
        date_summary: Dates.dateSummary(startDate, stopDate)
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
