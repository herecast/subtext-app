import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get, inject, computed } = Ember;

export default ModalInstance.extend(trackEvent, {
  session: inject.service(),

  avatarUrl: computed('model.userImageUrl', function(){
    const userImageUrl = get(this, 'model.userImageUrl');

    return (userImageUrl ? userImageUrl : '/images/user-default-avatar.svg');
  }),

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
