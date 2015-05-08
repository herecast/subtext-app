import Ember from 'ember';
import moment from 'moment';

export default Ember.Mixin.create({
  queryParams: ['category', 'query', 'startDate', 'stopDate', 'location', 'r'],

  category: 'everything',
  query: null,
  location: 'Upper Valley',

  // Change this value in the query params to force a refresh.
  r: false,

  // Default to this week
  startDate: moment().startOf('week').format('YYYY-MM-DD'),
  stopDate: moment().endOf('week').format('YYYY-MM-DD')
});
