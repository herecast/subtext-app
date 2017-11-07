import Ember from 'ember';

const {
  get,
  inject,
  set
} = Ember;

/** ContentLocations look like this:
 **
 * model.contentLocations = [
 *   { id: 1, locationType: 'base', locationId: 'munich-gm' },
 *   { id: 2, locationType: null, locationId: 'oslo-ny' }
 * ];
 */

export default Ember.Component.extend({
  tracking: inject.service(),
  store: inject.service(),
  session: inject.service(),
  userLocation: inject.service(),
  model: null,

  didReceiveAttrs() {
    this._super(...arguments);

    if(get(this, 'model._changedContentLocations.length')) {
      this._setupBaseLocation(get(this, 'model._changedContentLocations'));
    } else {
      const contentLocations = get(this, 'model.contentLocations');
      if (contentLocations) {
        contentLocations.then((contentLocations) => {
          if(!get(this, 'isDestroying')) {
            this._setupBaseLocation(contentLocations);
          }
        });
      }
    }
  },

  _confirmCurrentUserLocation(location) {
    const user = get(this, 'session.currentUser');
    if(!get(user, 'locationConfirmed')) {
      get(this, 'userLocation').saveSelectedLocationId(get(location, 'id'));
    }
  },

  _setupBaseLocation(contentLocations) {
    const base = contentLocations.findBy('locationType', 'base');

    if(base) {
      get(base, 'location').then((location) => {
        set(this, 'baseLocation', location);
      });
    }
  },

  actions: {
    updateRadius(radius){
      set(this, 'model.promoteRadius', radius);

      get(this, 'tracking').push({
        event: 'ChangePromoteRadius',
        radius: radius,
        selected_location: get(this, 'baseLocation.id')
      });
    },

    updateBaseLocation(location){
      get(this, 'tracking').push({
        event: 'ChangeSelectedLocation',
        new_location: get(location, 'id'),
        previous_location: get(this, 'baseLocation.id')
      });

      set(this, 'baseLocation', location);
      this._confirmCurrentUserLocation(location);
    },

    updateLocations(locations){
      const baseLocationId = get(this, 'baseLocation.id');
      const newContentLocations = locations.map((location) => {
        return get(this, 'store').createRecord('content-location', {
          location: location,
          locationType: (get(location, 'id') === baseLocationId ? 'base' : null)
        });
      });

      get(this, 'model').changeContentLocations(newContentLocations);
    }
  }
});
