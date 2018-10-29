import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  modals: service(),

  actions: {
    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    }
  }
});
