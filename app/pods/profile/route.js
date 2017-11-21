import Ember from 'ember';
import History from 'subtext-ui/mixins/routes/history';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import idFromSlug from 'subtext-ui/utils/id-from-slug';

const {get, inject: {service}} = Ember;

export default Ember.Route.extend(History, RouteMetaMixin, {
  tracking: service(),
  fastboot: service(),

  model(params) {
    return this.store.findRecord('organization', idFromSlug(params.organizationId));
  },

  titleToken(model) {
    return get(model, 'organization.name');
  },

  didTransition() {
    const routeName = this.routeName;
    const controller = this.controllerFor(routeName);
    const isFirstTransition = controller.get('isFirstTransition');

    if (!get(this, 'fastboot.isFastBoot')) {
      const model = this.modelFor(routeName);

      model.get('organization').then((organization) => {
        get(this, 'tracking').profileImpression(
          organization
        );
      });

      if (isFirstTransition) {
        Ember.$(window).scrollTop(0);
        controller.set('isFirstTransition', false);
      }
    }
  }

});
