import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Configuration from 'ember-simple-auth/configuration';

const {
  inject,
  RSVP: {Promise},
  get
} = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  fastboot: inject.service(),
  notify: inject.service('notification-messages'),
  session: inject.service(),
  cookies: inject.service('cookies'),
  titleToken: 'Sign in',

  // Override UnauthenticatedRouteMixin
  beforeModel(transition) {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    if(isFastBoot) {
      //Suspend redirecting because we need to wait for browser-mode
      //Ember to handle this. (Fastboot requests are unauthnticated)
      return;

    } else if('auth_token' in transition.queryParams) {

      return this.trySignInWithToken(transition.queryParams.auth_token);

    } else {

      const isAuthenticated = get(this, 'session.isAuthenticated');
      if(isAuthenticated) {
        return this.actions.transitionAfterAuthentication.bind(this)();
      }
    }

    return this._super();
  },

  trySignInWithToken(token) {
    return new Promise((resolve)=> {
      get(this, 'session').signInWithToken(token)
        .then(()=>{
          this.actions.transitionAfterAuthentication.bind(this)();
        })
        .catch((e)=>{
          console.error("An error occurred signing in with an auth token", e);
        })
        .finally(resolve);
    });
  },

  actions: {
    transitionAfterAuthentication() {
      const cookies = get(this, 'cookies');
      const redirectTarget = cookies.read('ember_simple_auth-redirectTarget');

      if(redirectTarget) {
        // Lets go back to where they were tring to go in the first place
        return this.replaceWith(redirectTarget).then(()=>{
          cookies.clear('ember_simple_auth-redirectTarget');
        });
      } else {
        return this.transitionTo(Configuration.routeAfterAuthentication);
      }
    }
  }
});
