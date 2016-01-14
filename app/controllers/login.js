import Ember from 'ember';

const {
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  userService: inject.service('user'),
  userMustConfirm: false,
  
  hasError: Ember.computed('userMustConfirm','error',function(){
    return get(this,'userMustConfirm') || !Ember.isEmpty(get(this,'error'));
  }),
  
  actions: {
    clearErrors() {
      set(this, 'userMustConfirm', false);
      set(this,'error',null);
    },
    authenticate: function(callback) {
      const data = this.getProperties('identification', 'password');
      const promise = get(this, 'session').authenticate('simple-auth-authenticator:devise', data);

      callback(promise);

      return promise.catch((response) => {
        // resend confirmation email
        if (response.error.indexOf('confirm') !== -1) {
          set(this,'userMustConfirm',true);
        } else {
          set(this, 'error', response.error);
        }
      });
    },
    reconfirm: function(){
      this.transitionToRoute('register.reconfirm', {queryParams: {
        email: get(this,'identification')
      }});
    }
  }
});
