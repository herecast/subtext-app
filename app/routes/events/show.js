import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';

export default Ember.Route.extend(EventFilter, {
  model(params) {
    return this.store.find('event', params.id);
  },

  setupController(controller, model) {
    this._super(controller, model);

    const eventInstances = this.store.find('event-instance', {event_id: model.get('id')});
    model.set('eventInstances', eventInstances);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo('events.index', {queryParams: filterParams});
    }
  }
});
