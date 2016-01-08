import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { computed } = Ember;

export default DS.Model.extend({
  endsAt: DS.attr('moment-date'),
  startsAt: DS.attr('moment-date', {defaultValue: moment()}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),

  formattedDate: computed('startsAt', 'endsAt', function() {
    const date = this.get('startsAt').format('MMM D');
    const startTime = this.get('startsAt').format('h:mmA');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${date} | ${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('h:mmA');

      return `${date} | ${startTime}-${endTime}`;
    }
  }),

  formattedHours: function() {
    const startTime = this.get('startsAt').format('LT');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  }.property('startsAt', 'endsAt'),

  timeRange: computed('startsAt', 'endsAt', function() {
    const startTime = this.get('startsAt').format('MMMM D, YYYY LT');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  })
});
