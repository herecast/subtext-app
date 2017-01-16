import Ember from 'ember';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
/* global dataLayer */

const { get, set, computed, inject } = Ember;

export default Ember.Component.extend(ModelResetScroll, {
  closeRoute: 'market.all',
  closeLabel: 'Market',

  activeImage: computed.oneWay('model.coverImageUrl'),

  featureFlags: inject.service('feature-flags'),

  showThumbnails: computed('model.images.[]', function() {
    return get(this, 'model.images.length') > 1;
  }),

  reset() {
    set(this, 'hasClickedReplyButton', false);
    set(this, 'activeImage', get(this, 'model.coverImageUrl'));
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.reset();
  },

  actions: {
    chooseImage(imageUrl) {
      set(this, 'activeImage', imageUrl);
    },

    clickReplyButton(selectedCannedReply) {
      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': 'market-reply-click',
          'chosen-reply': get(selectedCannedReply, 'label')
        });
      }
    }
  }
});
