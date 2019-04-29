import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';

export default Component.extend({
  classNames: ['ThumbnailImageModal'],

  _showImageModal: false,

  // Should be set when component is instantiated
  imageUrl: null,
  caption: null,
  title: 'Upload Image',
  aspectRatio: 4 / 3,
  enableCaption: true,
  isCircle: false,

  _unsetImage() {
    setProperties(this, {
      imageUrl: null,
      caption: null
    });
  },

  actions: {
    openImageModal() {
      set(this, '_showImageModal', true);
    },

    cancel() {
      set(this, '_showImageModal', false);
      this._unsetImage();
    },

    save(selectedImage, caption, imageUrl) {
      if (selectedImage) {
        get(this, 'saveImage')(selectedImage, caption, imageUrl);
      } else if (get(this, 'saveCaption')) {
        get(this, 'saveCaption')(caption);
      }

      set(this, '_showImageModal', false);
    }
  }
});
