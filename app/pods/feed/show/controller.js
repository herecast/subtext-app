import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    eventInstanceId: 'eventInstanceId'
  },

  eventInstanceId: null,
});