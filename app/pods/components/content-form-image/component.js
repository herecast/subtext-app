import $ from 'jquery';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { computed, setProperties, set, get } from '@ember/object';
import { isPresent, isBlank } from '@ember/utils';
import { registerWaiter } from '@ember/test';
import config from 'subtext-ui/config/environment';
/* global loadImage */

export default Component.extend({
  originalImageFile: null,
  originalImageUrl: null,
  displayImage: true,
  replacingImage: false,
  imageType: 'image/jpeg',
  hasNewImage: false,
  allowDeleteImage: false,
  wantsToDelete: false,

  // Image validation properties
  minWidth: 200,
  minHeight: 200,

  // To be passed in as a closure action for receiving/deleting the new image
  onImageUpdate(){},
  onImageDelete(){},

  // Display the JS image cropping tool if the user has attached an image
  displayImagePreview: computed('imageUrl', 'originalImageUrl', 'replacingImage', 'displayImageUrl', 'error', function () {
    const displayImage = get(this, 'displayImage');
    const hasNoError = isBlank(get(this, 'error'));
    const hasImage = isPresent(get(this, 'imageUrl'));
    const displayOldImage = isPresent(get(this, 'originalImageUrl')) && !get(this, 'replacingImage');

    return displayImage && hasNoError && (hasImage || displayOldImage);
  }),

  displayImageUrl: computed('originalImageUrl', 'imageUrl', function () {
    return get(this, 'imageUrl') || get(this, 'originalImageUrl');
  }),

  didInsertElement() {
    this._super(...arguments);

    const image = get(this, 'image');

    if (isPresent(image)) {
      this.loadImageFile(image);
    } else {
      const file = this.get('originalImageFile');
      if (isPresent(file)) {
        this.loadImageFile(file);
      }
    }
  },

  validateCanvasDimensions(canvas) {
    const $canvas = $(canvas);
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');

    if ($canvas.attr('width') < minWidth || $canvas.attr('height') < minHeight) {
      set(this, 'error', `Image must be at least ${minWidth}px wide by ${minHeight}px tall`);
      return false;
    } else {
      set(this, 'error', null);
      return true;
    }
  },

  loadImageFile(file) {
    const options = {
      orientation: true,
      canvas: true,

      // This reduces the image file size
      maxWidth: 2000,
      maxHeight: 2000
    };

    if (config.environment === 'test') {
      this._canvasLoaded = false;
      registerWaiter(() => this._canvasLoaded === true);
    }

    loadImage(file, (canvas) => {
      run(()=>{
        if (this.validateCanvasDimensions(canvas)) {
          this._saveCanvas(canvas, get(file, 'type'));
        }

        if (config.environment === 'test') {
          this._canvasLoaded = true;
        }

      });
    }, options);
  },

  _saveCanvas(canvas, imageType = null) {
    if (isBlank(imageType)) {
      imageType = get(this, 'imageType');
    }

    const url = canvas.toDataURL(imageType);
    const blobQuality = 0.8;

    set(this, 'imageType', imageType);
    this.set('imageUrl', url);

    if (config.environment === 'test') {
      this._blobLoaded = false;
      registerWaiter(() => this._blobLoaded === true);
    }

    canvas.toBlob((data) => {
      run(()=>{
        this.set('image', data);
        this.onImageUpdate(data);

        if (config.environment === 'test') {
          this._blobLoaded = true;
        }
      });
    }, imageType, blobQuality);
  },

  _removeImage() {
    this.setProperties({
      originalImageFile: null,
      originalImageUrl: null,
      imageUrl: null,
      replacingImage: true
    });
  },

  actions: {
    rotateImage(direction) {
      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        run(()=>{
          const { width, height } = image;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.setAttribute('width', height);
          canvas.setAttribute('height', width);

          ctx.translate(canvas.width / 2, canvas.height / 2);

          if (direction === 'left') {
            ctx.rotate(-0.5 * Math.PI);
          } else {
            ctx.rotate(0.5 * Math.PI);
          }

          ctx.drawImage(image, -width/2, -height/2);

          this._saveCanvas(canvas);
        });
      };

      image.src = get(this, 'displayImageUrl');
    },

    filesSelected(files) {
      const file = files[0];

      set(this, 'error', null);

      // Store the original file on the model so we can access it later
      setProperties(this, {
        originalImageFile: file,
        hasNewImage: true
      });

      // Use the "JavaScript Load Image" functionality to parse the file data
      // and get the correct orientation setting from the EXIF Data. This
      // addresses rotation issues with photos taken from mobile devices where
      // the meta data contains the orientation.
      this.loadImageFile(file);
    },

    fileError(msg) {
      this.setProperties({
        error: msg,
        originalImageFile: null
      });
    },

    removeImage() {
      this.$('.ContentForm-fileField')[0].click();
    },

    toggleWantsToDelete() {
      this.toggleProperty('wantsToDelete');
    },

    deleteImage() {
      //may want confirm here
      this._removeImage();
      this.onImageDelete();
    }
  }
});
