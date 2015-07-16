import Ember from 'ember';
import moment from 'moment';

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
    const startsAt = this.get('eventInstances.firstObject.startsAt');
    const params = {};

    if (startsAt) {
      params.startsAt = startsAt;
    } else {
      const newTime = moment();
      newTime.hour(12);
      newTime.minute(0);
      params.startsAt = newTime;
    }

    // A test started failing recently after an Ember upgrade because
    // this.store was not available. This is just a hack to ensure that it is.
    if (this.store) {
      const eventInstance = this.store.createRecord('event-instance', params);

      this.get('eventInstances').pushObject(eventInstance);
    }
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
