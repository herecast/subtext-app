import Ember from 'ember';

export default Ember.Controller.extend({
  showDescription: false,

  actions: {
    toggleDescription() {
      this.toggleProperty('showDescription');
    }
  }
});
