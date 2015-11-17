import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Service.extend({

  getCurrentUser: function() {
    // The current user endpoint does not take an ID, so we pass 'self' so that
    // it requests a single resource
    return this.store.find('current-user', 'self');
  },

  resendConfirmation: function(identification) {
    const url = `${config.API_NAMESPACE}/users/resend_confirmation`;
    return ajax(url, {
      type: 'POST',
      data: {
        user: {
          email: identification
        }
      }
    });
  }
});
