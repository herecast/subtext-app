import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';
const {
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend(trackEvent,{
  secondaryBackground: true,
  userService: inject.service('user'),
  userMustConfirm: false,

  hasError: Ember.computed('userMustConfirm', 'error', function(){
    return get(this, 'userMustConfirm') || !Ember.isEmpty(get(this, 'error'));
  }),
  actions: {
    trackForgotPassword() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'User Menu',
        navControl: 'Forgot Password'
      });
    },
    clearErrors() {
      set(this, 'userMustConfirm', false);
      set(this, 'error', null);
    },
    authenticate: function(callback) {
      let { identification, password } =  this.getProperties('identification', 'password');
      const promise = get(this, 'session').authenticate('authenticator:application', identification, password);

      callback(promise);

      return promise.catch((response) => {
        if (!get(this, 'isDestroyed')) {
          // resend confirmation email
          if (response.error.indexOf('confirm') !== -1) {
            set(this, 'userMustConfirm', true);
          } else {
            set(this, 'error', response.error);
          }
        }
      }).then(() => {
        this.trackEvent('signIn', {});
      });
    },
    reconfirm: function(){
      this.transitionToRoute('register.reconfirm', {queryParams: {
        email: get(this, 'identification')
      }});
    }
  }
});
