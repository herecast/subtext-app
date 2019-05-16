import { reads, alias } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import reloadComments from 'subtext-ui/mixins/reload-comments';

export default Component.extend(reloadComments, {
  classNames: 'FeedCard-NewsCard',
  classNameBindings: ['hideCompletely:hide-completely'],
  'data-test-news-card': reads('model.title'),

  model: null,
  userLocation: service(),
  context: null,
  sourceTag: null,
  showAnyViewCount: false,

  hideCompletely: false,

  canManage: computed('context.canManage', 'model.isDraft', function() {
    const isDraft = get(this, 'model.isDraft');

    if (!isDraft) {
      return get(this, 'context.canManage');
    }

    return false;
  }),

  hideComments: alias('context.hideComments'),

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
