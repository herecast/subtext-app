import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { set, get, inject } = Ember;

export default Ember.Component.extend(TestSelector, {
  "data-test-component": 'listserv-sign-in-form',
  session: inject.service(),
  windowLocation: inject.service(),
  email: null,
  password: null,
  callToAction: "Sign In",

  forgotPasswordReturnUrl: null,

  didInsertElement() {
    this._super(...arguments);
    const updateMetric = get(this, 'updateMetric');
    if (updateMetric) {
      updateMetric();
    }
  },

  actions: {
    authenticate(){
      set(this, 'session.skipRedirect', true);
      set(this, 'session.transitionTo', 'none');

      const ident = get(this, 'email');
      const password = get(this, 'password');
      const promise = get(this, 'session').authenticate('authenticator:application', ident, password);

      return promise.then(()=>{
        if('onSuccess' in this.attrs) {
          this.attrs.onSuccess();
        }
      }, (response) => {
        set(this, 'error', response.error);
      });
    }
  }
});
