import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, set, computed, inject:{service} } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-ListservCard',
  'data-test-listserv-card': computed.reads('model.title'),

  model: null,
  userLocation: service(),
  isLoggedIn: false,
  context: null,
  sourceTag: null,

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
