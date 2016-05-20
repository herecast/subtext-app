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

  displayImageForm: computed('needsImage', 'imageFormVisible', 'enableCaption', function() {
    return get(this, 'needsImage') || get(this, 'imageFormVisible') || ! get(this, 'enableCaption');
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
      this.attrs.cancel();
    },

    save() {
      const selectedImage = get(this, '_selectedImage'),
        caption = get(this, 'caption');

      this.attrs.save(selectedImage, caption);
    },

    showImageForm() {
      set(this, 'imageFormVisible', true);
    }
  }
});
