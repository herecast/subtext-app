import Ember from 'ember';

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  images: [],

  imageUrls: computed.mapBy('images', 'imageUrl'),

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  resetProperties() {
    const images = get(this, 'images');
    let imageUrl = '';

    // For legacy data where the primary flag may not be set, fall back to
    // the first image.
    const image = images.findBy('primary') || get(images, 'firstObject');

    if (image) {
      imageUrl = get(image, 'imageUrl');
    }

    set(this, 'currentImageUrl', imageUrl);
  },

  actions: {
    setCurrentUrl(url) {
      set(this, 'currentImageUrl', url);
    }
  }
});
