import { reads, oneWay, alias } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import reloadComments from 'subtext-ui/mixins/reload-comments';

export default Component.extend(reloadComments, {
  classNames: 'FeedCard-MarketCard',
  classNameBindings: ['hideCompletely:hide-completely'],
  'data-test-market-card': reads('model.title'),

  model: null,
  userLocation: service(),
  context: null,
  sourceTag: null,
  showAnyViewCount: false,

  hideCompletely: false,

  activeImageUrl: oneWay('model.primaryImageUrl'),

  isNotTalk: computed('model.contentType', function() {
    return get(this, 'model.contentType') !== 'talk';
  }),

  hideComments: alias('context.hideComments'),

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
