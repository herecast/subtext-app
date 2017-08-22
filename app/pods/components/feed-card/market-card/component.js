import Ember from 'ember';

const { get, set, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-MarketCard',

  model: null,
  userLocation: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'))) {
      routeName = get(this, 'model.organizationBizFeedActive') ? 'biz.show' : 'organization-profile';
    }

    return routeName;
  }),

  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('model.baseLocations.@each.{locationId,location.name}', 'userLocation.locationId', function() {
    const baseLocations = get(this, 'model.baseLocations');
    const userLocation = get(this, 'userLocation');

    // Display location matching user if multiple bases
    let baseLocation = baseLocations.findBy('location.id', get(userLocation, 'locationId')) ||
      get(baseLocations, 'firstObject');

    return isPresent(baseLocation) ? get(baseLocation, 'locationName') : undefined;
  }),

  actions: {
    stopEditing() {
      set(this, 'isEditing', false);
    }
  }
});
