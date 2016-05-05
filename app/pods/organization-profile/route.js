import Ember from 'ember';
import History from 'subtext-ui/mixins/routes/history';

const { isEmpty, set } = Ember;

export default Ember.Route.extend(History, {
  historyRouteName: 'organization-profile',
  model: function(params) {
    const slug = params.slug;
    set(this, 'historyRouteModel', slug);

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
