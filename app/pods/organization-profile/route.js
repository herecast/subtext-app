import Ember from 'ember';

const { isEmpty } = Ember;

export default Ember.Route.extend({
  model: function(params) {
    const slug = params.slug;
    const numerics = slug.match(/\d+/);
    if(isEmpty(numerics)) {
      return {};
    } else {
      const id = numerics[0];

      return this.store.findRecord('organization', id);
    }
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.setProperties({
      page: 1,
      query: ""
    });
  }

});
