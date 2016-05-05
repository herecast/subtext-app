import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  email: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  listservId: DS.attr('number'),
  listservName: DS.attr('string'),
  location: DS.attr('string'),
  locationId: DS.attr('number'),
  name: DS.attr('string'),
  testGroup: DS.attr('string'),
  userId: DS.attr('number'),
  managed_organizations: DS.hasMany('organizations', { async: true }),
  canPublishNews: DS.attr('boolean')
});
