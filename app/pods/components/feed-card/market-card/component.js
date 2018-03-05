import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, set, computed, inject:{service} } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-MarketCard',
  'data-test-market-card': computed.reads('model.title'),

  model: null,
  userLocation: service(),
  context: null,
  sourceTag: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

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
