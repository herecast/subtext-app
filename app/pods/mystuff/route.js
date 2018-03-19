import Ember from 'ember';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { get, inject:{service} } = Ember;

export default Ember.Route.extend(Authorized, FastbootTransitionRouteProtocol, {
  fastboot: service(),

  actions: {
    didTransition() {
      if(!get(this, 'fastboot.isFastBoot')) {
        Ember.$('html,body').scrollTop(0);
      }
    },
  }
});
