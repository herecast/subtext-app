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

  visibleImages: computed('images.@each._delete', function() {
    const images = get(this, 'images');

    return images.rejectBy('_delete');
  }),

  underImageLimit: computed.lt('visibleImages.length', maxImages),

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

      if (get(image, 'isNew')) {
        Ember.run(() => get(this, 'images').removeObject(image));
      } else {
        // If an image has already been persisted, reset imageUrl so it's
        // hidden from the page, and flag it with "_delete" so it will be
        // destroyed when the market post is saved.
        set(image, 'imageUrl', null);
        set(image, '_delete', true);
      }

      if (isPrimaryImage) {
        const firstImage = get(this, 'images')
          .filter((image) => isPresent(get(image, 'imageUrl')))
          .get('firstObject');

        if(firstImage) {
          set(firstImage, 'primary', 1);
        }
      }

      this.resetProperties();
    },

    setPrimary(image) {
      get(this, 'images').setEach('primary', 0);
      set(image, 'primary', 1);
    }
  }
});
