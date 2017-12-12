import Ember from 'ember';
import DS from 'ember-data';

const {
  get,
  computed,
  Mixin
} = Ember;

export default Mixin.create({
  contentLocations: DS.hasMany(),
  baseLocations: computed.filterBy('contentLocations', 'locationType', 'base'),
  promoteRadius: DS.attr('number'),
  ugcBaseLocation: DS.belongsTo('location'),

  baseLocation: computed.alias('ugcBaseLocation'),

  promotedLocations: computed('contentLocations.[]', function() {
    return get(this, 'contentLocations').mapBy('location');
  }),

  baseLocationNames: computed('baseLocations.@each.locationName', 'ugcBaseLocation.name', function() {
    const baseLocationNames = get(this, 'baseLocations').mapBy('locationName');
    const ugcBaseLocationName = get(this, 'ugcBaseLocation.name');

    if(baseLocationNames.includes(ugcBaseLocationName)) {
      return baseLocationNames;
    } else {
      // UGC location changed
      return [ugcBaseLocationName];
    }
  }),
});
