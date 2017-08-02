import DS from 'ember-data';

export default DS.Model.extend({
  location: DS.belongsTo(),
  locationId: DS.attr(),
  locationType: DS.attr('string'), // 'base', 'about', or empty
});
