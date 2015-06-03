import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
  // This is used by the filter query params to force a refresh whenever the
  // page changes.
  time: function() {
    return moment().unix();
  }.property('applicationController.currentPath')
});
