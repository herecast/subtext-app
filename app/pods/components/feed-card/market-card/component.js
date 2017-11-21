import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const {get, set, computed, isPresent} = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-MarketCard',

  model: null,
  userLocation: null,
  isLoggedIn: false, //Overridden in feed-card
  context: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'))) {
      routeName = get(this, 'model.organizationBizFeedActive') ? 'biz.show' : 'organization-profile';
    }

    return routeName;
  }),

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

  canAccessContent: computed('model.isListserv', 'isLoggedIn', function() {
    const isListserv = get(this, 'model.isListserv');
    const isLoggedIn = get(this, 'isLoggedIn');

    if (!isListserv) {
      return true;
    } else {
      return isLoggedIn;
    }
  }),

  actions: {
    stopEditing() {
      set(this, 'isEditing', false);
    },

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
