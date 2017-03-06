import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  set,
  computed,
  inject
} = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['ImageUploadTiles'],
  store: inject.service('store'),

  isAddingNewImage: false,

  nonDeletedImages: computed.filterBy('images', '_delete', undefined),

  uploadAllowed: computed.lt('nonDeletedImages.length', 6),

  // Override to handle in parent context
  addImage(image) {
    const images = get(this, 'images');

    if(!images.rejectBy('_delete').isAny('primary')) {
      image.set('primary', true);
    }
    images.pushObject(image);

    set(this, 'error', null);
  },

  // Override to handle in parent context
  removeImage(image) {
    set(image, '_delete', true);
  },

  // Override to handle in parent context
  setPrimary(image) {
    get(this, 'images').setEach('primary', false);
    set(image, 'primary', true);
  },

  actions: {
    setProcessingStatus(status) {
      // need to display a spinner as this operation
      // can be lengthy on some low power devices
      if (status === 'start') {
        set(this, 'isAddingNewImage', true);
      } else if (status === 'end' || status === null) {
        set(this, 'isAddingNewImage', false);
      }
    },

    newImage({img, file}) {
      const imageCount = get(this, 'nonDeletedImages.length');

      if (imageCount < 6) {
        const image = get(this, 'store').createRecord('image', {
          imageUrl: img.src,
          width: img.width,
          height: img.height,
          file: file
        });

        this.addImage(image);
      }
    },

    dismissError() {
      set(this, 'error', null);
    },

    imageError(e) {
      set(this, 'error', e.message);
    }
  }
});
