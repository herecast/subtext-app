import Ember from 'ember';
import EventFilter from '../../../mixins/routes/event-filter';
import Track from '../../../mixins/routes/track-pageview';

export default Ember.Route.extend(EventFilter, Track, {
  queryParams: {
    r: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.find('event-instance', {
      category: params.category,
      query: params.query,
      date_start: params.date_start,
      date_end: params.date_end,
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
