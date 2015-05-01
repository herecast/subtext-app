import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  contactUrl: DS.attr('string'),
  content: DS.attr('string'),
  cost: DS.attr('string'),
  costType: DS.attr('string'),
  endsAt: DS.attr('moment-date'),
  eventUrl: DS.attr('string'),
  image: DS.attr('string'),
  startsAt: DS.attr('moment-date'),
  subtitle: DS.attr('string'),
  ticketType: DS.attr('string'),
  title: DS.attr('string'),
  venueAddress: DS.attr('string'),
  venueCity: DS.attr('string'),
  venueName: DS.attr('string'),
  venuePhone: DS.attr('string'),
  venueState: DS.attr('string'),
  venueUrl: DS.attr('string'),
  venueZipcode: DS.attr('string'),

  spansDays: function() {
    const start = this.get('startsAt');
    const end = this.get('endsAt');

    return moment().diff(start, end) > 0;
  }.property('startsAt', 'endsAt'),

  timeRange: function() {
    const startTime = this.get('startsAt').format('LT');
    const endTime = this.get('endsAt').format('LT');

    return `${startTime} - ${endTime}`;
  }.property('startsAt', 'endsAt'),

  longTimeRange: function() {
    const start = this.get('startsAt').format('dddd, MMMM Do LT');
    let endFormat = 'LT';

    if (this.get('spansDays')) {
      endFormat = 'dddd, MMMM Do LT';
    }

    const end = this.get('endsAt').format(endFormat);

    return `${start} to ${end}`;
  }.property('startsAt', 'endsAt')
});
