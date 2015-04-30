import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';

export default Ember.Route.extend(EventFilter, {
  model(params) {
    return this.store.find('event', {
      category: params.category
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('totalEvents', this.store.metadataFor('event').total);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo({queryParams: filterParams});
      this.refresh();
    }
  }
});
