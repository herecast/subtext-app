import Ember from 'ember';

const { get, set, isBlank, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['ThumbnailImageModal'],

  _showImageModal: false,
  _selectedImage: null,
  _originalImageUrl: null,

  // Should be set when component is instantiated
  imageUrl: null,
  caption: null,
  title: 'Upload Image',
  aspectRatio: 4 / 3,
  enableCaption: true,
  isCircle: false,

  imageFormVisible: false,

  needsImage: computed('_originalImageUrl', function() {
    return isBlank(get(this, '_originalImageUrl'));
  }),

  displayImageForm: computed('needsImage', 'imageFormVisible', 'enableCaption', function() {
    return get(this, 'needsImage') || get(this, 'imageFormVisible') || ! get(this, 'enableCaption');
  }),

  saveDisabled: computed('_originalImageUrl', '_selectedImage', function() {
    return isBlank(get(this, 'imageUrl')) && isBlank(get(this, '_selectedImage'));
  }),

  actions: {
    openImageModal() {
      set(this, '_selectedImage', null);
      set(this, '_originalImageUrl', get(this, 'imageUrl'));
      set(this, 'imageFormVisible', false);
      set(this, '_showImageModal', true);
    },

    cancelImageModal() {
      set(this, 'imageUrl', get(this, '_originalImageUrl'));
      set(this, '_showImageModal', false);
    },

    save() {
      const selectedImage = get(this, '_selectedImage'),
        caption = get(this, 'caption');

      if (selectedImage) {
        this.attrs.saveImage(selectedImage, caption);
      } else if ('saveCaption' in this.attrs) {
        this.attrs.saveCaption(caption);
      }

      set(this, '_showImageModal', false);
    },

    showImageForm() {
      set(this, 'imageFormVisible', true);
    }
  }
});
