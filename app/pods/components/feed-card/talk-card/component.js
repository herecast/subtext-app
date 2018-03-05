import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, computed } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-TalkCard',

  model: null,
  userLocation: null,
  context: null,
  sourceTag: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

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
