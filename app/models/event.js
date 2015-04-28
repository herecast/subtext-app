import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  description: DS.attr('string'),
  ticketType: DS.attr('string'),
  cost: DS.attr('string'),
  contactName: DS.attr('string'),
  contactPhone: DS.attr('string'),
  contactEmail: DS.attr('string'),
  url: DS.attr('string'),
  venueName: DS.attr('string'),
  address1: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  startsAt: DS.attr('date'),
  endsAt: DS.attr('date'),
  photoUrlSmall: DS.attr('string')
});
