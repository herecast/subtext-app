import Ember from 'ember';

const {get, set} = Ember;

export default Ember.Component.extend({
  radius: '10',

  onChooseRadius: null,
  onChooseLocation: null,
  onNearbyLocationsChanged: null,
  noRadius: false,

  actions: {
    chooseRadius(radius) {
      set(this, 'radius', radius);
      const onChooseRadius = get(this, 'onChooseRadius');
      if (onChooseRadius) {
        onChooseRadius(radius);
      }
    },
    chooseLocation(location) {
      set(this, 'location', location);
      const onChooseLocation = get(this, 'onChooseLocation');
      if (onChooseLocation) {
        onChooseLocation(location);
      }
    },
  }
});
