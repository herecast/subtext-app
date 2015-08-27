import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    submit() {
      this.get('model').save();
    }
  }
});
