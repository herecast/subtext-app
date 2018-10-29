import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';

export default Route.extend(UnauthenticatedRouteMixin, FastbootExtensions, {
  titleToken: 'Registration Complete!',
  session: service(),
  logger: service(),
  notify: service('notification-messages'),

  beforeModel(transition) {
      /**
     * We don't authenticate in fastboot
     * So let's defer this until ember-browser
     */
    if(get(this, 'session.isAuthenticated')) {
      this.transitionTo('index');
      return;
    }

    if(!get(this, 'isFastBoot')) {
      const token = transition.params['register.confirm']['token']; const notify = get(this, 'notify');

      get(this, 'session').authenticate('authenticator:confirmation', token).then(() => {
        this.transitionTo('index').then(() => {
          notify.success('Registration complete. You are now signed in.');
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
