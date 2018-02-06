import Ember from 'ember';
import DS from 'ember-data';

const {
  get,
  computed
} = Ember;

/*
 * NOTE: we can return a lot of this from the backend and clean this up a lot
 *
 * from Nik:
 * ```
 * We need content-locations relationship for read only
 * ugcBaseLocationId and promoteRadius
 * for the ugc location selector
 * I think the baseLocationNames is used in the cards to determine the location to display
 * We used to need all the content location data for the ugc form. I moved most of that logic to the backend.
 * Now all we need are the requirements for display, and the ugcBaseLocation, promoteRadius
 * ```
 */
export default Ember.Mixin.create({
  promoteRadius: DS.attr('number'),

  ugcBaseLocation: DS.belongsTo('location'),
  baseLocation: computed.alias('ugcBaseLocation'),

  contentLocations: DS.hasMany(),
  baseLocations: computed.filterBy('contentLocations', 'locationType', 'base'),

  promotedLocations: computed('contentLocations.[]', function() {
    return get(this, 'contentLocations').mapBy('location');
  }),

  baseLocationNames: computed('baseLocations.@each.locationName', 'baseLocation.name', function() {
    const baseLocationNames = get(this, 'baseLocations').mapBy('locationName');
    const ugcBaseLocationName = get(this, 'ugcBaseLocation.name');

    if(baseLocationNames.includes(ugcBaseLocationName)) {
      return baseLocationNames;
    } else if(ugcBaseLocationName) {
      // UGC location changed
      return [ugcBaseLocationName];
    } else {
      return baseLocationNames.slice(0);
    }
  })
});
