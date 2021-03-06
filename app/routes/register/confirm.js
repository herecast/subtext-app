import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Registration Complete!',
  fastboot: service(),
  session: service(),
  logger: service(),
  notify: service('notification-messages'),

  beforeModel(transition) {
      /**
     * We don't authenticate in fastboot
     * So let's defer this until ember-browser
     */
    if(get(this, 'session.isAuthenticated')) {
      this.transitionTo('feed');
      return;
    }

    if(!get(this, 'fastboot.isFastBoot')) {
      const token = transition.params['register.confirm']['token']; const notify = get(this, 'notify');

      get(this, 'session').authenticate('authenticator:confirmation', token).then(() => {
        this.transitionTo('feed').then(() => {
          notify.success('Sign up complete. You are now logged in.');
        });
      }).catch(() => {
        get(this, 'logger').error(new Error("Authentication Error"));
        this.transitionTo('register.error');
      });

    }
  },

  actions: {
    error() {
      this.transitionTo('register.error');
    }
  }
});
