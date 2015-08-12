import Ember from 'ember';

export default Ember.Service.extend({

  getCurrentUser: function() {
    // The current user endpoint does not take an ID, so we pass 'self' so that
    // it requests a single resource
    return this.store.find('current-user', 'self');
  }
});
