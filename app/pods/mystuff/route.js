import Ember from 'ember';
import AuthenticatedRouteProtocol from 'subtext-ui/mixins/routes/authenticated-route-protocol';

const { get, inject:{service} } = Ember;

export default Ember.Route.extend(AuthenticatedRouteProtocol, {
  fastboot: service(),

  actions: {
    didTransition() {
      if(!get(this, 'fastboot.isFastBoot')) {
        Ember.$('html,body').scrollTop(0);
      }
    },
  }
});
