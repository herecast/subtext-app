import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get, inject } = Ember;

export default ModalInstance.extend(trackEvent, {
  session: inject.service(),

  close() {
    this.ok();
  },

  actions: {
    signOut() {
      get(this, 'session').signOut();
    },

    trackUserMenu(navControlText) {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'User Account Menu',
        navControl: navControlText
      });
    },
  }
});
