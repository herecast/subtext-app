import Ember from 'ember';
/* global loadImage */

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  classNames: ['ImageUpload'],
  classNameBindings: ['isPrimary'],

  image: null,

  init() {
    this._super(...arguments);
    this.resetProperties();
    this.setupOriginalImage();
  },

  resetProperties() {
    this.setProperties({
      canvas: null,
      croppedImageUrl: null,
      showCropper: false
    });
  },

  isPrimary: computed('image.primary', function() {
    return (get(this, 'image.primary') === 1);
  }),

  // When a user attaches an image and proceeds to a further step in the
  // creation process, this lets them go back to the first step and use the
  // original image.
  setupOriginalImage() {
    const originalImage = get(this, 'image.originalImageFile');

    if (originalImage) {
      this.setupImage(originalImage);
    }
  },

  imageUrl: computed.oneWay('image.imageUrl'),

  setImageUrl: function() {
    const croppedImageUrl = get(this, 'croppedImageUrl');
    const canvas = get(this, 'canvas');
    const image = get(this, 'image');

    if (croppedImageUrl || canvas) {
      const url = croppedImageUrl || canvas.toDataURL();

      set(image, 'imageUrl', url);
    }
  }.observes('canvas', 'croppedImageUrl'),

  imageName: computed('image.originalImageFile.name', 'imageUrl', function() {
    const originalFileName = get(this, 'image.originalImageFile.name');

    if (originalFileName) {
      return originalFileName;
    } else {
      // We're not persisting the original file name when an image is uploaded,
      // so we need to grab it from the file name on S3.
      const fileName = get(this, 'imageUrl').split('/').get('lastObject');
      return fileName;
    }
  }),

  updateCanvas(file) {
    loadImage.parseMetaData(file, (data) => {
      const options = {
        // Convert to a canvas object so that we can pass it to the Cropper lib
        canvas: true,

        // For cropping performance, this reduces the image file size
        // before opening the cropper.
        maxWidth: 1000
      };

      // Reorient images that have orientation data. This usually affects iPhone
      // images that normally appear rotated on their side.
      if (data.exif) {
        options.orientation = data.exif.get('Orientation');
      }

      // Because loadImage is asynchronous, when the canvas property is
      // changed, it triggers a function that updates the imageUrl on an image.
      loadImage(file, (canvas) => {
        set(this, 'canvas', canvas);
      }, options);
    });
  },

  setupImage(file) {
    this.updateCanvas(file);

    set(this, 'image.file', file);
  },

  actions: {
    removeImage(image) {
      this.attrs.remove(image);
    },

    addImage(file) {
      set(this, 'image.originalImageFile', file);

      this.setupImage(file);
    },

    filesSelected(files) {
      this.send('addImage', files[0]);
    },

    showCropper() {
      set(this, 'showCropper', true);
    },

    updateImageModelProperties(file, imageUrl) {
      const image = get(this, 'image');

      set(image, 'file', file);
      set(image, 'imageUrl', imageUrl);

      set(this, 'showCropper', false);
    },

    hideCropper() {
      set(this, 'showCropper', false);
    },

    setPrimary(image) {
      this.attrs.setPrimary(image);
    }
  }
});
