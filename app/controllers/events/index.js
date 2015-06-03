import Ember from 'ember';
import EventFilter from '../../mixins/controllers/event-filter';

export default Ember.Controller.extend(EventFilter, {
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
});
