import Ember from 'ember';

const {get, set, isPresent, inject, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['LocationRadiusSelector'],
  classNameBindings: ['radiusDisabled:radius-buttons-disabled'],
  modals: inject.service(),

  radiusChoices: [10, 20, 50],
  radiusDisabled: false,

  radius: '10',
  isMyStuffOnly: computed.equal('radius', 'myStuff'),

  location: null,
  noRadius: false,

  actions: {
    chooseRadius(radius) {
      if (!get(this, 'radiusDisabled')) {
        set(this, 'radius', radius);
        const onChooseRadius = get(this, 'onChooseRadius');
        if (onChooseRadius) {
          onChooseRadius(radius);
        }
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
