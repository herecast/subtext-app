import Ember from 'ember';

export default Ember.Component.extend({
  addDate: function() {
    const eventInstance = this.store.createRecord('event-instance');
    this.get('eventInstances').pushObject(eventInstance);
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
      instance.destroyRecord();
      this.get('eventInstances').removeObject(instance);
    }
  }
});
