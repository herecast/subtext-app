import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';

const { isEmpty, set } = Ember;

export default Ember.Route.extend(PaginatedFilter, History, {
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
  },

  activate() {
    set(this.controllerFor('application'), 'channelLinksEnabled', false);
  },

  deactivate() {
    set(this.controllerFor('application'), 'channelLinksEnabled', true);
  }

});
