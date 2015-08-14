import Ember from 'ember';
import Dates from '../../lib/dates';

export default Ember.Mixin.create({
  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'r'],

  // Change this value in the query params to force a refresh.
  r: false,

  defaultCategory: 'Everything',

  defaultQuery: function() {
    return null;
  }.property(),

  defaultLocation: function() {
    const location = this.get('session.currentUser.location');

    if (Ember.isPresent(location)) {
      return location;
    } else {
      return 'All Communities';
    }
  }.property('session.currentUser.location'),

  defaultStart: function() {
    const currentUser = this.get('session.currentUser');

    if (currentUser) {
      return Dates.startOfMonth();
    } else {
      return Dates.today();
    }
  }.property('session.currentUser'),

  defaultEnd: function() {
    const currentUser = this.get('session.currentUser');

    if (currentUser) {
      return Dates.endOfMonth();
    } else {
      return Dates.today();
    }

  }.property('session.currentUser'),

  category: Ember.computed.oneWay('defaultCategory'),
  location: Ember.computed.oneWay('defaultLocation'),
  query: Ember.computed.oneWay('defaultQuery'),
  date_start: Ember.computed.oneWay('defaultStart'),
  date_end: Ember.computed.oneWay('defaultEnd'),

  // Used to make the variable names more JSish and still let us pass the
  // right params to the API.
  startDate: Ember.computed.alias('date_start'),
  stopDate: Ember.computed.alias('date_end')
});
