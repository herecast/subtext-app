import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';

export default Ember.Route.extend(EventFilter, {
  model(params) {
    return this.store.find('event', params.id);
  },

  setupController(controller, model) {
    this._super(controller, model);

    const otherInstances = this.store.find('event-instance', {event_id: model.get('id')});
    controller.set('otherInstances', otherInstances);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo('events.index', {queryParams: filterParams});
    }
  }
});
