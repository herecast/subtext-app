import Ember from 'ember';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { get, set, inject:{service} } = Ember;

export default Ember.Mixin.create(Authorized, {
  fastboot: service(),

  //There is a conflict between ember-cli-fastboot and ember-simple-auth
  //The two addons each add a colon to the protocol when redirecting for authentication
  //Rather than fork the repos and point to specific commits, we use this custom
  //step to make sure the redircting works as expected for the protected route
  beforeModel() {
    if (get(this, 'fastboot.isFastBoot')) {
      const protocol = get(this, 'fastboot.request.protocol');

      if (protocol.endsWith(':')) {
        set(this, 'fastboot.request.protocol', protocol.slice(0, -1));
      }
    }

    this._super(...arguments);
  },
});
