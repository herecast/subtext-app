import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,

  actions: {
    authenticate: function(callback) {
      const data = this.getProperties('identification', 'password');
      const promise = this.get('session').authenticate('simple-auth-authenticator:devise', data);

      callback(promise);

      return promise.catch((response) => {
        this.set('error', response.error);
      });
    }
  }
});
