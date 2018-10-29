import { oneWay } from '@ember/object/computed';
import $ from 'jquery';
import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
/* global loadImage */

export default Component.extend({
  classNames: ['ImageUpload'],
  classNameBindings: ['isPrimary'],
  minWidth: 200,
  minHeight: 200,

  image: null,
  showImageEditor: false,
  hasNewImage: false,

  init() {
    this._super(...arguments);
    this.setupOriginalImage();
  },

  isPrimary: computed('image.primary', function() {
    return get(this, 'image.primary');
  }),

  // When a user attaches an image and proceeds to a further step in the
  // creation process, this lets them go back to the first step and use the
  // original image.
  setupOriginalImage() {
    if (isBlank(get(this, 'imageUrl'))) {
      const originalImage = get(this, 'image.originalImageFile');
      if (originalImage) {
        this.setupImage(originalImage);
      }
    }
  },

  imageUrl: oneWay('image.imageUrl'),

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

  setupImage(file) {
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');

    loadImage.parseMetaData(file, () => {
      const options = {
        // Convert to a canvas object so that we can validate it
        canvas: true,

        // This reduces the image file size
        maxWidth: 1000
      };
      // Because loadImage is asynchronous, when the canvas property is
      // changed, it triggers a function that updates the imageUrl on an image.
      loadImage(file, (canvas) => {
        run(() => {
          const $canvas = $(canvas);
          if ($canvas.attr('width') < minWidth || $canvas.attr('height') < minHeight) {
            set(this, 'fileErrorMessage', `Image must be at least ${minWidth}px wide by ${minHeight}px tall`);
            return false;
          } else {
            set(this, 'fileErrorMessage', null);
            set(this, 'image.file', file);
            set(this, 'image.imageUrl', canvas.toDataURL(get(file, 'type')));
          }
        });
      }, options);
    });
  },

  actions: {
    removeImage(image) {
      get(this, 'remove')(image);
    },

    addImage(file) {
      set(this, 'image.originalImageFile', file);
      this.setupImage(file);
    },

    filesSelected(files) {
      set(this, 'hasNewImage', true);
      this.send('addImage', files[0]);
    },

    showImageEditor() {
      set(this, 'showImageEditor', true);
    },

    saveImage(file) {
      this.setupImage(file);
      this.send('hideImageEditor');
    },

    hideImageEditor() {
      set(this, 'showImageEditor', false);
    },

    setPrimary(image) {
      get(this, 'setPrimary')(image);
    }
  }
});
