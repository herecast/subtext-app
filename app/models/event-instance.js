import DS from 'ember-data';

export default DS.Model.extend({
  endsAt: DS.attr('moment-date'),
  startsAt: DS.attr('moment-date'),
  subtitle: DS.attr('string'),

  timeRange: function() {
    const startTime = this.get('startsAt').format('MMMM, Do, YYYY, LT');
    const endTime = this.get('endsAt').format('LT');

    return `${startTime} - ${endTime}`;
  }.property('startsAt', 'endsAt'),
});
