import Ember from 'ember';

const {
  get,
  inject,
  set
} = Ember;

export default Ember.Component.extend({
  tracking: inject.service(),
  store: inject.service(),
  session: inject.service(),
  userLocation: inject.service(),
  model: null,

  _confirmCurrentUserLocation(location) {
    const user = get(this, 'session.currentUser');
    if(!get(user, 'locationConfirmed')) {
      get(this, 'userLocation').saveSelectedLocationId(get(location, 'id'));
    }
  },

  actions: {
    updateRadius(radius){
      set(this, 'model.promoteRadius', radius);

      get(this, 'tracking').push({
        event: 'ChangePromoteRadius',
        radius: radius,
        selected_location: get(this, 'model.ugcBaseLocation.id')
      });
    },

    updateBaseLocation(location){
      get(this, 'tracking').push({
        event: 'ChangeSelectedLocation',
        new_location: get(location, 'id'),
        previous_location: get(this, 'model.ugcBaseLocation.id')
      });

      set(this, 'model.ugcBaseLocation', location);
      this._confirmCurrentUserLocation(location);
    }
  }
});
