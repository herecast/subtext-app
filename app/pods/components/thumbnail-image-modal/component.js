import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Component.extend({
  classNames: ['ThumbnailImageModal'],

  _showImageModal: false,
  _selectedImage: null,

  // Should be set when component is instantiated
  imageUrl: null,
  title: 'Upload Image',
  aspectRatio: 4 / 3,

  actions: {
    openImageModal() {
      set(this, '_showImageModal', true);
    },

    closeImageModal() {
      set(this, '_showImageModal', false);
      set(this, '_selectedImage', null);
    },

    saveImage() {
      this.attrs.saveImage(get(this, '_selectedImage'));
      this.send('closeImageModal');
    }
  }
});
