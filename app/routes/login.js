import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { inject, get } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  fastboot: inject.service(),
  cookies: inject.service('cookies'),
  titleToken: 'Sign in',

  // Override UnauthenticatedRouteMixin
  beforeModel() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    if(isFastBoot) {
      //Suspend redirecting because we need to wait for browser-mode
      //Ember to handle this. (Fastboot requests are unauthnticated)
      return;
    } else {
      const cookies = get(this, 'cookies');
      const redirectTarget = cookies.read('ember_simple_auth-redirectTarget');
      const isAuthenticated = get(this, 'session.isAuthenticated');
      if(isAuthenticated && redirectTarget) {
        // Lets go back to where they were tring to go in the first place
        return this.transitionTo(redirectTarget).then(()=>{
          cookies.clear('ember_simple_auth-redirectTarget');
        });
      }
    }

    return this._super();
  }
});
