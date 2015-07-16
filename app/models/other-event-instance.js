import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  endsAt: DS.attr('moment-date'),
  startsAt: DS.attr('moment-date', {defaultValue: moment()}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),
  formattedDate: function() {
    return this.get('startsAt').format('MMMM D, YYYY');
  }.property('startsAt'),

  formattedHours: function() {
    const startTime = this.get('startsAt').format('LT');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  }.property('startsAt', 'endsAt')
});
