import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';

const { get, inject } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, FastbootExtensions, {
  titleToken: 'Registration Complete!',
  session: inject.service(),
  notify: inject.service('notification-messages'),

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
        console.error("Authentication Error");
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
