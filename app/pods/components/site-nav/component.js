import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'SiteNav',

  session: service(),
  modals: service(),

  currentUser: readOnly('session.currentUser'),

  hideAll: readOnly('session.isFastBoot'),
  showAvatar: readOnly('session.isAuthenticated'),

  showMenu: false,

  actions: {
    toggleMenu() {
      this.toggleProperty('showMenu');

      if (get(this, 'showMenu')) {
        get(this, 'modals').addModalBodyClass();
      } else {
        get(this, 'modals').removeModalBodyClass();
      }
    },

    signIn() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },
  }
});
