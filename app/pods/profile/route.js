import Ember from 'ember';
import History from 'subtext-ui/mixins/routes/history';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import idFromSlug from 'subtext-ui/utils/id-from-slug';

const {get, set, isPresent, inject: {service}} = Ember;

export default Ember.Route.extend(History, RouteMetaMixin, {
  tracking: service(),
  fastboot: service(),

  model(params) {
    return this.store.findRecord('organization', idFromSlug(params.organizationId));
  },

  //TEMPORARY HARDCODE WHILE BACK END IS SORTED OUT
  afterModel(model) {
    const isListservOrganization = parseInt(get(model, 'id')) === 447;
    if (isListservOrganization) {
      set(model, 'name', 'Community Discussion Lists');
    }
  },

  titleToken(model) {
    const organization = model;

    if (isPresent(organization)) {
      return get(organization, 'name');
    }

    return 'DailyUV';
  }
});
