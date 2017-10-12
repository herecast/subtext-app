import Ember from 'ember';

const {get, set, isPresent, inject, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['LocationRadiusSelector'],
  modals: inject.service(),

  radiusChoices: [10, 20, 50],

  radius: '10',
  isMyStuffOnly: computed.equal('radius', 'myStuff'),

  location: null,

  actions: {
    chooseRadius(radius) {
      set(this, 'radius', radius);
      const onChooseRadius = get(this, 'onChooseRadius');
      if (onChooseRadius) {
        onChooseRadius(radius);
      }
    },
    showLocationMenu() {
      const modalContext = {
        location: get(this, 'location')
      };
      const onChooseLocation = get(this, 'onChooseLocation');

      if (isPresent(onChooseLocation)) {
        modalContext.onChooseLocation = (location) => {
          set(this, 'location', location);
          onChooseLocation(location);
        };
      }

      get(this, 'modals').showModal('modals/location-menu', modalContext);
    }
  }
});
