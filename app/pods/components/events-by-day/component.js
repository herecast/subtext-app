import Component from '@ember/component';
import momentComputed from 'ember-moment/computeds/moment';
import format from 'ember-moment/computeds/format';
import { A } from '@ember/array';

export default Component.extend({
  classNames: ['EventsByDay'],
  'data-test-component': 'events-by-day',

  events: A(),
  selectDay: null,
  maxDisplay: 5,

  openCalendar: function(){},
  buttonDisplayDate: format(momentComputed('day', 'dddd, MMMM D'), 'MMMM D')
});
