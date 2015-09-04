import Ember from 'ember';
import Dates from '../../lib/dates';

export default Ember.Mixin.create({
  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'r',
    'page', 'per_page'
  ],

  // Change this value in the query params to force a refresh.
  r: false,

  page: 1,
  per_page: 24,

  defaultCategory: 'Everything',

  defaultQuery: function() {
    return null;
  }.property(),

  defaultLocation: 'All Communities',

  defaultStart: Dates.startOfWeek(),
  defaultEnd: Dates.endOfWeek(),

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
