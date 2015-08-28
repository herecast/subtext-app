import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  email: DS.attr('string'),
  imageUrl: DS.attr('string'),
  listservId: DS.attr('number'),
  listservName: DS.attr('string'),
  location: DS.attr('string'),
  locationId: DS.attr('number'),
  name: DS.attr('string'),
  testGroup: DS.attr('string'),
  userId: DS.attr('string')
});
