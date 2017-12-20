import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';

const { isEmpty, get, set, inject } = Ember;

export default Ember.Route.extend(PaginatedFilter, History, {
  session: inject.service(),
  tracking: inject.service(),
  fastboot: inject.service(),
  queryCache: inject.service(),
  notify: inject.service('notification-messages'),
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

  afterModel(model) {
    //Note: Need to remove this route and create rewrite to profile
    const organizationId = get(model, 'id');

    if (!get(this, 'fastboot.isFastBoot')) {
      get(this, 'notify').warning(
        `<div>This URL will expire January 10, 2018, but this page lives on.
        <a href="/profile/${organizationId}">Click to see and bookmark the new version!</a></div>`,
        {
          htmlContent: true,
          autoClear: false
        }
      );
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
  },

  actions: {
    didTransition() {
      if(!get(this, 'fastboot.isFastBoot')) {
        get(this, 'tracking').profileImpression(
          this.modelFor(this.routeName)
        );

        return true;
      }
    }
  }

});
