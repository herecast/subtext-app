import DS from 'ember-data';

export default DS.Model.extend({
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  contactUrl: DS.attr('string'),
  content: DS.attr('string'),
  cost: DS.attr('string'),
  costType: DS.attr('string'),
  endsAt: DS.attr('date'),
  eventUrl: DS.attr('string'),
  image: DS.attr('string'),
  startsAt: DS.attr('date'),
  subtitle: DS.attr('string'),
  ticketType: DS.attr('string'),
  title: DS.attr('string'),
  venueAddress: DS.attr('string'),
  venueCity: DS.attr('string'),
  venueName: DS.attr('string'),
  venuePhone: DS.attr('string'),
  venueState: DS.attr('string'),
  venueUrl: DS.attr('string'),
  venueZipcode: DS.attr('string')
});
