import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-NewsCard',
  'data-test-news-card': computed.reads('model.title'),

  model: null,
  userLocation: service(),
  context: null,
  sourceTag: null,

  canManage: computed('context.canManage', 'model.isDraft', function() {
    const isDraft = get(this, 'model.isDraft');

    if (!isDraft) {
      return get(this, 'context.canManage');
    }

    return false;
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
