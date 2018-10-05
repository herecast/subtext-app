import Ember from 'ember';

const { computed, get, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'UserLocation',

  userLocation: service(),

  userLocationName: computed.readOnly('userLocation.userLocation.name'),
  isLoadingLocation: computed.readOnly('userLocation.isLoadingLocation'),

  showLocationName: computed('userLocationName', 'isLoadingLocation', function() {
    return isPresent(get(this, 'userLocationName')) && !get(this, 'isLoadingLocation');
  }),

  actions: {
    clickLocation() {
      if (get(this, 'onClickLocation')) {
        get(this, 'onClickLocation')();
      }
    }
  }
});
