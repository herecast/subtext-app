import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';

export default Ember.Route.extend(Track, {
  queryParams: {
    r: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.find('talk', {
      query: params.query,
      date_start: params.date_start,
      date_end: params.date_end
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query');

    this.controllerFor('talk/all').setProperties(filterParams);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo({queryParams: filterParams});
      this.refresh();
    }
  }
});
