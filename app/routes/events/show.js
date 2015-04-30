import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';

export default Ember.Route.extend(EventFilter, {
  model(params) {
    return this.store.find('event', params.id);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo('events.index', {queryParams: filterParams});
    }
  }
});
