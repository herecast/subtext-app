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

  noRadius: false,
  trackChanges: true,

  _confirmCurrentUserLocation(location) {
    const user = get(this, 'session.currentUser');
    if(!get(user, 'locationConfirmed')) {
      get(this, 'userLocation').saveSelectedLocationId(get(location, 'id'));
    }
  },

  actions: {
    updateRadius(radius){
      set(this, 'model.promoteRadius', radius);

      if (get(this, 'trackChanges')) {
        get(this, 'tracking').push({
          event: 'ChangePromoteRadius',
          radius: radius,
          selected_location: get(this, 'model.location.id')
        });
      }

      if (get(this, 'onChangeRadius')) {
        get(this, 'onChangeRadius')(radius);
      }
    },

    updateBaseLocation(location){
      set(this, 'model.location', location);

      if (get(this, 'trackChanges')) {
        get(this, 'tracking').push({
          event: 'ChangeSelectedLocation',
          new_location: get(location, 'id'),
          previous_location: get(this, 'model.location.id')
        });

        this._confirmCurrentUserLocation(location);
      }

      if (get(this, 'onChangeLocation')) {
        get(this, 'onChangeLocation')(location);
      }
    }
  }
});
