import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Registration Complete!',

  model: function(params) {
    const token = params.token;
    const promise = this.get('session').authenticate('authenticator:confirmation', token);

    return promise;
  },

  actions: {
    error: function() {
      this.transitionTo('register.error');
    }
  }
});
