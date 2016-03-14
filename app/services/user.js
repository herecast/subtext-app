import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Service.extend({
  api: inject.service('api'),
  getCurrentUser: function() {
    // The current user endpoint does not take an ID, so we pass 'self' so that
    // it requests a single resource
    return this.store.find('current-user', 'self');
  },

  resendConfirmation: function(identification) {
    const api = get(this, 'api');

    return api.resendConfirmation(identification);
  }
});
