import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { get, inject } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Registration Complete!',
  session: inject.service(),
  toast: inject.service(),

  beforeModel(transition) {
    const token = transition.params['register.confirm']['token'];
    const toast = get(this, 'toast');

    get(this, 'session').authenticate('authenticator:confirmation', token).then(() => {
      this.transitionTo('index.index').then(() => {
        toast.success('Registration complete. You are now signed in.');
      });
    }).catch(() => {
      this.transitionTo('register.error');
    });
  },

  actions: {
    error() {
      this.transitionTo('register.error');
    }
  }
});
