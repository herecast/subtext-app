import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-TalkCard',

  model: null,
  userLocation: null,
  context: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

  sourceTag: computed('userLocation.locationId', function() {
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
