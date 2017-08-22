import DS from 'ember-data';

export default DS.Model.extend({
  location: DS.belongsTo('location'),
  locationId: DS.attr(),
  locationType: DS.attr('string'), // 'base', 'about', or empty
  locationName: DS.attr('string')
});
