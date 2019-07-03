import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { Promise } from 'rsvp';
import { get } from '@ember/object';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
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
    }

    return this._super();
  },

  trySignInWithToken(token) {
    return new Promise((resolve) => {
      get(this, 'session').signInWithToken(token)
      .catch((e) => {
        get(this, 'logger').error('An error occurred signing in with an auth token.', e);
      })
      .finally(resolve);
    });
  },
});
