import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { Promise } from 'rsvp';
import { get } from '@ember/object';
import WillAuthenticateMixin from 'subtext-ui/mixins/routes/will-authenticate';

export default Route.extend(WillAuthenticateMixin, {
  fastboot: service(),
  session: service(),
  titleToken: 'Sign in',
  logger: service(),

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
          get(this, 'logger').error('An error occurred signing in with an auth token.', e);
        })
        .finally(resolve);
    });
  },
});
