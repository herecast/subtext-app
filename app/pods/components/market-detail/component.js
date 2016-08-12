import Ember from 'ember';

const { get, set, computed } = Ember;

export default Ember.Component.extend({
  closeRoute: 'market.all',
  closeLabel: 'Market',

  activeImage: computed.oneWay('model.coverImageUrl'),

  showThumbnails: computed('model.images.[]', function() {
    return get(this, 'model.images.length') > 1;
  }),

  actions: {
    chooseImage(imageUrl) {
      set(this, 'activeImage', imageUrl);
    }
  }
});
