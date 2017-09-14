import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';

const { isEmpty, get, set, inject } = Ember;

export default Ember.Route.extend(PaginatedFilter, History, {
  session: inject.service(),
  fastboot: inject.service(),
  queryCache: inject.service(),
  historyRouteName: 'organization-profile',

  beforeModel() {
    if(!get(this, 'fastboot.isFastBoot') && 
        get(this, 'session.isAuthenticated')) {

      // We need to get a fresh model, in case
      // we have the ability to take actions on
      // this organization.
      get(this, 'queryCache').disableCache();
    }
  },

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

  serialize(model) {
    return {
      slug: model.get('slug')
    };
  }

});
