import Ember from 'ember';

const {
  computed,
  get,
  isEmpty,
  isPresent,
  set
} = Ember;

const maxImages = 6;

export default Ember.Component.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  images: computed.alias('model.images'),
  underImageLimit: computed.lt('images.length', maxImages),

  resetProperties() {
    const images = get(this, 'images');

    if (isEmpty(images)) {
      const initialImage = get(this, 'store').createRecord('image', {
        primary: 1
      });

      set(this, 'images', [initialImage]);
    }
  },

  actions: {
    addImage() {
      const newImage = get(this, 'store').createRecord('image', { primary: 0 });

      get(this, 'images').pushObject(newImage);
    },

    removeImage(image) {
      const isPrimaryImage = get(image, 'primary');

      Ember.run(() => get(this, 'images').removeObject(image));

      if (isPrimaryImage) {
        const firstImage = get(this, 'images')
          .filter((image) => isPresent(get(image, 'imageUrl')))
          .get('firstObject');

        if(firstImage) {
          set(firstImage, 'primary', 1);
        }
      }
    },

    setPrimary(image) {
      get(this, 'images').setEach('primary', 0);
      set(image, 'primary', 1);
    }
  }
});
