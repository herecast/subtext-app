import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  fastboot: service(),

  //There is a an issue with ember-cli-fastboot (this app's version)
  //When the app triggers a transitionTo during fastboot
  //an extra colon is added to the protocol and transition fails
  //Rather than fork the repo and point to specific commit, we use this custom
  //step to make sure the redircting works as expected for the any route
  //that has a transition during fastboot render
  //Upgrading fastboot should render this redundant and unnecessary
  beforeModel() {
    if (get(this, 'fastboot.isFastBoot')) {
      const protocol = get(this, 'fastboot.request.protocol');

      if (protocol.endsWith(':')) {
        set(this, 'fastboot.request.protocol', protocol.slice(0, -1));
      }
    }

    this._super(...arguments);
  }
});
