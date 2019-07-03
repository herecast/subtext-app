import { readOnly, and, not } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'SiteNav',

  session: service(),
  modals: service(),

  currentUser: readOnly('session.currentUser'),

  notFastBoot: not('session.isFastBoot'),
  showAvatar: and('session.isAuthenticated', 'notFastBoot'),

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
