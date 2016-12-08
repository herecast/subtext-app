import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import Ember from 'ember';

const { get, inject, computed, isPresent } = Ember;

export default ModalInstance.extend({
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
