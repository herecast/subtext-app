import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Component.extend({
  classNames: ['ThumbnailImageModal'],

  _showImageModal: false,

  // Should be set when component is instantiated
  imageUrl: null,
  caption: null,
  title: 'Upload Image',
  aspectRatio: 4 / 3,
  enableCaption: true,
  isCircle: false,

  actions: {
    openImageModal() {
      set(this, '_showImageModal', true);
    },

    cancel() {
      set(this, '_showImageModal', false);
    },

    save(selectedImage, caption) {
      if (selectedImage) {
        get(this, 'saveImage')(selectedImage, caption);
      } else if (get(this, 'saveCaption')) {
        get(this, 'saveCaption')(caption);
      }

      set(this, '_showImageModal', false);
    }
  }
});
