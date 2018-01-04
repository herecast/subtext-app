import Ember from 'ember';
import momentComputed from 'ember-moment/computeds/moment';
import format from 'ember-moment/computeds/format';

export default Ember.Component.extend({
  classNames: ['EventsByDay'],
  'data-test-component': 'events-by-day',

  selectDay: null,
  maxDisplay: 5,
  events: [], // override in the parent context

  openCalendar: function(){},
  buttonDisplayDate: format(momentComputed('day', 'dddd, MMMM D'), 'MMMM D'),

});
