import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Configuration from 'ember-simple-auth/configuration';

export default Mixin.create(UnauthenticatedRouteMixin, {
  cookies: service('cookies'),

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
