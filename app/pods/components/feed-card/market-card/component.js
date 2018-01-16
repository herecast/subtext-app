import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, set, computed, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-MarketCard',
  'data-test-market-card': computed.reads('model.title'),

  model: null,
  userLocation: service(),
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
