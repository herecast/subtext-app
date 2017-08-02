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
      get(this, 'tracking').push({
        event: 'ChangeRadius',
        channel: get(this, 'channel'),
        old_value: get(this, 'radius'),
        new_value: radius
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
