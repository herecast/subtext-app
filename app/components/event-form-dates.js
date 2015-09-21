import Ember from 'ember';

export default Ember.Component.extend({
  eventInstances: [],

  // Events must have at least one date, so this prevents the user from
  // removing the last one.
  isRemovable: Ember.computed.gt('eventInstances.length', 1),

  bubbleValidation: function() {
    const isValid = this.get('eventInstances').isEvery('isValid');

    this.sendAction('afterValidation', isValid);
  }.observes('eventInstances.@each.isValid'),

  addDate: function() {
    const eventInstance = this.store.createRecord('event-instance');
    this.get('eventInstances').pushObject(eventInstance);
  },

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
