import Ember from 'ember';

export default Ember.Component.extend({
  addDate: function() {
    this.get('eventInstances').pushObject(Ember.Object.create());
  },

  addInitialDate: function() {
    const eventInstances = this.get('eventInstances');

    if (eventInstances && Ember.isEmpty(eventInstances)) {
      this.addDate();
    }
  }.on('didInsertElement'),

  actions: {
    addNewDate() {
      this.addDate();
    },

    removeDate(instance) {
      this.get('eventInstances').removeObject(instance);
    }
  }
});
