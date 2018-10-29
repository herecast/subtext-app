import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { set, get, computed } from '@ember/object';

export default Controller.extend({
  userService: service('user'),
  queryParams: ['email'],

  callToActionDisabled: computed('email',function(){
    const pattern = /\S+@\S+\.\S+/;
    let email = get(this,'email');
    if (email) {
      return !pattern.test(email.toString());
    }
    return true;
  }),

  actions: {
    reconfirm: function(callback) {
      const promise = get(this,'userService').resendConfirmation(get(this,'email'));
      callback(promise);
      promise.then(()=>{
        this.transitionToRoute('register.complete');
      }).catch((response)=>{
        if(response.errorThrown === "Not Found") {
          set(this,'error', "Not Found");
        }
      });
    }
  }
});
