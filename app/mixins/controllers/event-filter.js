import Ember from 'ember';
import Dates from '../../lib/dates';

export default Ember.Mixin.create({
  session: Ember.inject.service('session'),

  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'r'],

  startDate: Ember.computed.alias('date_start'),
  stopDate: Ember.computed.alias('date_end'),

  category: 'Everything',
  query: null,

  location: function() {
    const location = this.get('session.currentUser.location');

    if (Ember.isPresent(location)) {
      return location;
    } else {
      return 'All Communities';
    }
  }.property('session.currentUser.location'),

  // Change this value in the query params to force a refresh.
  r: false,

  date_start: function() {
    const currentUser = this.get('session.currentUser');

    if (currentUser) {
      return Dates.startOfMonth();
    } else {
      return Dates.today();
    }
  }.property('session.currentUser'),

  date_end: function() {
    const currentUser = this.get('session.currentUser');

    if (currentUser) {
      return Dates.endOfMonth();
    } else {
      return Dates.today();
    }

  }.property('session.currentUser'),
});
