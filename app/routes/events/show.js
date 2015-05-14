import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';

export default Ember.Route.extend(EventFilter, {
  model(params) {
    const eventInstance = this.store.getById('event-instance', params.id);

    // Force the event instance to reload if it's already found in the store.
    // This lets us get the more detailed record from the show API endpoint,
    // rather than relying on what's in the store from the index endpoint.
    if (eventInstance) {
      return eventInstance.reload();
    } else {
      return this.store.find('event-instance', params.id);
    }
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo('events.index', {queryParams: filterParams});
    }
  }
});
