import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,

  actions: {
    afterRegister() {
      this.transitionToRoute('register.complete');
    }
  }
});
