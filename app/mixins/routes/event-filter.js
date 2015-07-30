import Ember from 'ember';

export default Ember.Mixin.create({

  // Set the query params on the parent events controller so that it's
  // available in the filter on the index and show pages.
  setupController(controller, model) {
    this._super(controller, model);

    const filterParams = controller.getProperties(
      'category', 'query', 'startDate', 'stopDate', 'location'
    );

    this.controllerFor('events/all').setProperties(filterParams);
  }
});

