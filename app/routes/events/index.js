import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';

export default Ember.Route.extend(EventFilter, {
  queryParams: {
    r: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.find('event-instance', {
      category: params.category,
      query: params.query,
      startDate: params.startDate,
      stopDate: params.stopDate,
      location: params.location
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('totalEvents', this.store.metadataFor('event-instance').total);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo({queryParams: filterParams});
      this.refresh();
    }
  }
});
