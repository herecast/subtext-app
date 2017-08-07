import Ember from 'ember';

const {get, set, inject} = Ember;

export default Ember.Mixin.create({
  channel: null, // required

  queryParams: ['radius'],

  tracking: inject.service(),
  userLocation: inject.service(),

  radius: 10,

  actions: {
    changeRadius(radius) {
      get(this, 'tracking').changeSearchRadius(radius, {
        channel: get(this, 'channel'),
        oldRadius: get(this, 'radius')
      });

      set(this, 'radius', radius);
    },
    chooseLocation(location) {
      const channel = get(this, 'channel');
      const userLocation = get(this, 'userLocation');

      get(this, 'tracking').push({
        event: "ChooseLocation",
        location_id: get(userLocation, 'location.id'),
        new_location_name: get(location, 'name'),
        new_location_id: get(location, 'id')
      });

      userLocation.navigateToLocation(location, channel);
    }
  }
});
