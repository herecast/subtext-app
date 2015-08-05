import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  location: DS.attr('string'),
  userId: DS.attr('string'),
  createdAt: DS.attr('date'),
  testGroup: DS.attr('string')
});
