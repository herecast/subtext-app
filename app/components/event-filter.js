import Ember from 'ember';
import Dates from '../lib/dates';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  refreshParam: Ember.inject.service('refresh-param'),
  mixpanel: Ember.inject.service('mixpanel'),

  actions: {
    submit() {
      const filterParams = this.getProperties('category', 'query', 'location');
      const startDate = this.get('startDate');
      const stopDate = this.get('stopDate');

      filterParams.date_start = startDate;
      filterParams.date_end = stopDate;
      filterParams.r = this.get('refreshParam.time');

      this.get('mixpanel').trackEvent('Event Search', {
        'Category': this.get('category'),
        'Query': this.get('query'),
        'Location': this.get('location'),
        'Date Summary': Dates.dateSummary(startDate, stopDate)
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
