import Ember from 'ember';

export default Ember.Controller.extend({
  showPasswordForm: false,
  actions: {
    submit() {
      this.get('model').save();
    },
    togglePasswordForm() {
      this.toggleProperty('showPasswordForm');
    }
  }
});
