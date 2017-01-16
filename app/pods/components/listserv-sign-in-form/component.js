import Ember from 'ember';

const { set, get, inject } = Ember;

export default Ember.Component.extend(trackEvent, {
  "data-test-component": 'listserv-sign-in-form',
  session: inject.service(),
  windowLocation: inject.service(),
  email: null,
  password: null,
  callToAction: "Sign In",

  forgotPasswordReturnUrl: null,

  actions: {
    authenticate(){
      set(this, 'session.skipRedirect', true);
      set(this, 'session.transitionTo', 'none');

      const ident = get(this, 'email');
      const password = get(this, 'password');
      const promise = get(this, 'session').authenticate('authenticator:application', ident, password);

      return promise.catch((response) => {
        set(this, 'error', response.error);
      });
    }
  }
});
