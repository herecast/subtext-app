import Ember from 'ember';
import WillAuthenticateMixin from 'subtext-ui/mixins/routes/will-authenticate';

const {
  inject,
  RSVP: {Promise},
  get
} = Ember;

export default Ember.Route.extend(WillAuthenticateMixin, {
  fastboot: inject.service(),
  session: inject.service(),
  titleToken: 'Sign in',
  logger: inject.service(),

  // Override UnauthenticatedRouteMixin
  beforeModel(transition) {
    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if (isFastBoot) {
      //Suspend redirecting because we need to wait for browser-mode
      //Ember to handle this. (Fastboot requests are unauthnticated)
      return;
    } else if ('auth_token' in transition.queryParams) {
      return this.trySignInWithToken(transition.queryParams.auth_token);
    } else {
      const isAuthenticated = get(this, 'session.isAuthenticated');
      if (isAuthenticated) {
        return this.transitionAfterAuthentication();
      }
    }

    return this._super();
  },

  trySignInWithToken(token) {
    return new Promise((resolve) => {
      get(this, 'session').signInWithToken(token)
        .then(() => {
          this.transitionAfterAuthentication();
        })
        .catch((e) => {
          e.message = ['An error occurred signing in with an auth token.', e.message].join(' ');
          get(this, 'logger').error(e);
        })
        .finally(resolve);
    });
  },
});
