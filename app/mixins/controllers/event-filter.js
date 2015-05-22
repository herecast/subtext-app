import Ember from 'ember';
import moment from 'moment';

export default Ember.Mixin.create({
  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'r'],

  startDate: Ember.computed.alias('date_start'),
  stopDate: Ember.computed.alias('date_end'),

  category: 'Everything',
  query: null,
  location: 'Upper Valley',

  // Change this value in the query params to force a refresh.
  r: false,

  // Default to this week
  date_start: moment().startOf('week').format('YYYY-MM-DD'),
  date_end: moment().endOf('week').format('YYYY-MM-DD')
});
