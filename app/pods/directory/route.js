import Ember from 'ember';

const { RSVP } = Ember;

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      categories: this.store.find('business-category')
    });
  },

  setupController(controller, model) {
    controller.set('categories', model.categories);
  }
});
