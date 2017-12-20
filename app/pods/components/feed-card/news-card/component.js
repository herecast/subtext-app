import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';
import canEditFeedCard from 'subtext-ui/mixins/components/can-edit-feed-card';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend(reloadComments, canEditFeedCard, {
  classNames: 'FeedCard-NewsCard',
  'data-test-news-card': computed.reads('model.title'),

  model: null,
  userLocation: null,
  context: null,

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    const shouldLinkToProfile = get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'));

    return shouldLinkToProfile ? 'profile' : null;
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
