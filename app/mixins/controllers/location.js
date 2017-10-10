import Ember from 'ember';

const {get, set, computed, inject} = Ember;

export default Ember.Mixin.create({
  channel: null, // required

  queryParams: ['radius'],

  tracking: inject.service(),
  userLocation: inject.service(),

  radius: '10', // note, this query-param has to be a string so Ember doesn't cast 'me' to a Number
  isMyStuffOnly: computed.equal('radius', 'me'),

  actions: {
    changeRadius(radius) {
      get(this, 'tracking').changeSearchRadius(radius, {
        channel: get(this, 'channel'),
        oldRadius: get(this, 'radius')
      });

      set(this, 'radius', radius);
    },
    chooseMyStuffOnly() {
      get(this, 'tracking').trackMyStuffClick();
      this.transitionToRoute('feed', {queryParams: {
        radius: 'me',
        page: 1
      }});
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

      // Work around until we remove events channel
      if(channel === 'events') {
        userLocation.navigateToLocation(location, 'events');
        return;
      }

      userLocation.saveSelectedLocationId(get(location, 'id'));
      this.transitionToRoute('feed', {
        queryParams: {
          location: get(location, 'id')
        }
      });
    }
  }
});
