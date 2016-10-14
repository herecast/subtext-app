import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get, inject, computed, isPresent } = Ember;

export default ModalInstance.extend(trackEvent, {
  session: inject.service(),
  router: inject.service('-routing'),
  currentUser: computed.alias('session.currentUser'),

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

    openDashboard(org) {
      let id = null;

      if(isPresent(org)) {
        id = org.id;
      }

      get(this, 'router').transitionTo('dashboard', null, {
        organization_id: id
      });

      this.close();
    }
  }
});
