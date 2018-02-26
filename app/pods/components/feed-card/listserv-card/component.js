import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, set, computed, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-ListservCard',
  'data-test-listserv-card': computed.reads('model.title'),

  model: null,
  userLocation: service(),
  isLoggedIn: false,
  context: null,

  sourceTag: computed('userLocation.locationId', function() {
    const baseLocations = get(this, 'model.baseLocations');
    const userLocation = get(this, 'userLocation');

    // Display location matching user if multiple bases
    let baseLocation = baseLocations.findBy('id', get(userLocation, 'locationId')) ||
      get(baseLocations, 'firstObject');

    if (isPresent(baseLocation)) {
      return `${get(baseLocation, 'name')} List`;
    } else {
      return undefined;
    }
  }),

  canAccessContent: computed.alias('isLoggedIn'),

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
