import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import reloadComments from 'subtext-app/mixins/reload-comments';

export default Component.extend(reloadComments, {
  classNames: 'FeedCard-FullsizeCard',
  classNameBindings: ['hideCompletely:hide-completely'],
  'data-test-fullsize-card': readOnly('model.title'),

  model: null,
  userLocation: service(),
  context: null,
  sourceTag: null,
  showAnyViewCount: false,

  hideCompletely: false,

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
