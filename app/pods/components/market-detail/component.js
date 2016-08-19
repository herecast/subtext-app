import Ember from 'ember';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

const { get, set, computed } = Ember;

export default Ember.Component.extend(ModelResetScroll, {
  closeRoute: 'market.all',
  closeLabel: 'Market',

  hasClickedReplyButton: false,

  activeImage: computed.oneWay('model.coverImageUrl'),

  showThumbnails: computed('model.images.[]', function() {
    return get(this, 'model.images.length') > 1;
  }),

  actions: {
    chooseImage(imageUrl) {
      set(this, 'activeImage', imageUrl);
    },

    clickReplyButton() {
      get(this, 'model').loadContactInfo().then(() => {
        this.toggleProperty('hasClickedReplyButton');
      });
    }
  }
});
