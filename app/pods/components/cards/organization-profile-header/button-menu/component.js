import Ember from 'ember';

const {get, inject} = Ember;

export default Ember.Component.extend({
  modals: inject.service(),

  actions: {
    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    }
  }
});
