import Ember from 'ember';

const {get, inject, computed, isPresent} = Ember;

export default Ember.Component.extend({
  'data-test-component': 'location-mismatch-prompt',
  userLocation: inject.service(),
  tracking: inject.service(),
  fastboot: inject.service(),
  routing: inject.service('-routing'),

  currentRouteName: computed.readOnly('userLocation.currentRouteName'),
  currentRouteParams: computed.readOnly('userLocation.currentRouteParams'),

  activeLocationId: computed.readOnly('userLocation.activeLocationId'),
  activeLocation: computed.readOnly('userLocation.activeLocation'),

  selectedLocationId: computed.readOnly('userLocation.selectedLocationId'),
  selectedLocation: computed.readOnly('userLocation.selectedLocation'),

  /**
   * Only show the message if the current location
   * is not the same as the one the user selected previously.
   */
  shouldShowWarning: computed('fastboot.isFastBoot', 'activeLocationId', 'selectedLocationId', 'isLocationRouteActive', function () {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    const isLocationRouteActive = get(this, 'userLocation.isLocationRouteActive');
    const activeLocationId = get(this, 'activeLocationId');
    const selectedLocationId = get(this, 'selectedLocationId');

    return !isFastBoot && isLocationRouteActive && isPresent(activeLocationId) && (String(activeLocationId) !== String(selectedLocationId));
  }),

  locationLinkParams: computed('currentRouteName', 'currentRouteParams', 'selectedLocation.{id,name}', function () {
    const userLocation = get(this, 'userLocation');
    const location = get(this, 'selectedLocation');
    const selectedLocationId = get(this, 'selectedLocationId');

    return {
      location,
      route: get(this, 'currentRouteName'),
      model: userLocation.getModelsForLocationLink(selectedLocationId),
    };
  }),

  actions: {
    saveSelectedLocationId(locationId) {
      get(this, 'tracking').push({
        'VirtualComponent': 'location-mismatch-prompt',
        event: 'SaveSelectedLocation',
        selected: locationId
      });

      const userLocation = get(this, 'userLocation');
      userLocation.saveSelectedLocationId(locationId);
    },
    navigateToLocation(locationLink) {
      get(this, 'tracking').push({
        'VirtualComponent': 'location-mismatch-prompt',
        event: 'SwitchLocation',
        selected: get(locationLink, 'location.id')
      });

      const router = get(this, 'routing.router');

      // Note: we still want to call `saveSelectedLocationId`
      // to ensure we update BOTH the location cookie and the current user's location.
      // For example:
      // It's possible the user had a cookie to one location, which then became their active location through a redirect
      // Then, the user could log in with a user account which has a different location on it.
      // If we don't set the value for both the cookie and the user,
      // the user will always see this prompt each time they log in.
      this.send('saveSelectedLocationId', get(locationLink, 'location.id'));
      router.transitionTo(locationLink.route, ...locationLink.model);
    },
  }
});
