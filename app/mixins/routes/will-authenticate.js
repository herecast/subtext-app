import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Configuration from 'ember-simple-auth/configuration';

const {
  inject,
  get
} = Ember;

export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
  cookies: inject.service('cookies'),

  transitionAfterAuthentication() {
    const cookies = get(this, 'cookies');
    const redirectTarget = cookies.read('ember_simple_auth-redirectTarget');
    
    if (redirectTarget) {
      // Lets go back to where they were trying to go in the first place
      return this.replaceWith(redirectTarget).then(() => {
        cookies.clear('ember_simple_auth-redirectTarget');
      });
    } else {
      return this.transitionTo(Configuration.routeAfterAuthentication);
    }
  },

  actions: {
    transitionAfterAuthentication() {
      this.transitionAfterAuthentication();
    }
  }
});
