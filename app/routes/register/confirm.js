import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { get, inject } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Registration Complete!',
  session: inject.service(),
  notify: inject.service('notification-messages'),

  beforeModel(transition) {
    const token = transition.params['register.confirm']['token'];
    const notify = get(this, 'notify');

    get(this, 'session').authenticate('authenticator:confirmation', token).then(() => {
      this.transitionTo('index.index').then(() => {
        notify.success('Registration complete. You are now signed in.');
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
