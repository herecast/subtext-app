import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-TalkCard',

  model: null,
  userLocation: null,
  isLoggedIn: false,
  context: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

  // TODO: refactor duplications (๏д๏)
  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    const shouldLinkToProfile = get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'));

    return shouldLinkToProfile ? 'profile' : null;
  }),

  // TODO: refactor duplications (๏д๏)
  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('model.baseLocations.@each.{locationId,location.name}', 'model.isListserv', 'userLocation.locationId', function() {
    const baseLocations = get(this, 'model.baseLocations');
    const userLocation = get(this, 'userLocation');

    // Display location matching user if multiple bases
    let baseLocation = baseLocations.findBy('location.id', get(userLocation, 'locationId')) ||
      get(baseLocations, 'firstObject');

    const isListserv = get(this, 'model.isListserv');

    if (isPresent(baseLocation)) {
      return `${get(baseLocation, 'locationName')}${isListserv ? ' List' : ''}`;
    } else {
      return undefined;
    }
  }),

  actions: {
    onContentClick() {
      const onContentClick = get(this, 'context.onContentClick');
      if (onContentClick) {
        onContentClick();
      }
    },

    openPromotionMenu() {
      const openPromotionMenu = get(this, 'context.openPromotionMenu');
      if (openPromotionMenu) {
        openPromotionMenu();
      }
    }
  }
});
