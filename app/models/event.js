import DS from 'ember-data';
import moment from 'moment';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default DS.Model.extend({
  category: DS.attr('string'),
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  cost: DS.attr('string'),
  costType: DS.attr('string'),
  eventInstances: DS.attr('raw', {defaultValue: []}),
  endsAt: DS.attr('moment-date', {defaultValue: moment()}),
  eventUrl: DS.attr('string'),
  extendedReachEnabled: DS.attr('boolean', {defaultValue: true}),
  imageUrl: DS.attr('string'),
  socialEnabled: DS.attr('boolean', {defaultValue: true}),
  startsAt: DS.attr('moment-date', {defaultValue: moment()}),
  subtitle: DS.attr('string'),
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
  }.property('startsAt', 'endsAt'),

  publish() {
    const url = `${config.API_NAMESPACE}/events/${this.get('id')}/publish`;
    return ajax(url, {type: 'POST'});
  }
});
