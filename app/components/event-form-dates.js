import Ember from 'ember';

export default Ember.Component.extend({
  addDate: function() {
    if (this.get('dates')) {
      this.get('dates').pushObject(Ember.Object.create());
    }
  }.on('didInsertElement'),

  actions: {
    addNewDate() {
      this.addDate();
    },

    removeDate(date) {
      this.get('dates').removeObject(date);
    }
  }
});
