import Ember from 'ember';

const { get, set, isBlank, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['ImageEditor'],

  _selectedImage: null,
  _originalImageUrl: null,

  // Should be set when component is instantiated
  imageUrl: null,
  caption: null,
  title: 'Upload Image',
  aspectRatio: 4 / 3,
  enableCaption: true,

  imageFormVisible: false,

  needsImage: computed('_originalImageUrl', function() {
    return isBlank(get(this, '_originalImageUrl'));
  }),

  saveDisabled: computed('_originalImageUrl', '_selectedImage', function() {
    return isBlank(get(this, 'imageUrl')) && isBlank(get(this, '_selectedImage'));
  }),

  init() {
    this._super();
    set(this, '_originalImageUrl', get(this, 'imageUrl'));
  },

  actions: {
    cancel() {
      set(this, 'imageUrl', get(this, '_originalImageUrl'));
      get(this, 'cancel')();
    },

    save() {
      const selectedImage = get(this, '_selectedImage'),
        imageUrl = get(this, 'imageUrl'),
        caption = get(this, 'caption') || '';

      get(this, 'save')(selectedImage, caption, imageUrl);
    },

    showImageForm() {
      set(this, 'imageFormVisible', true);
    }
  }
});
