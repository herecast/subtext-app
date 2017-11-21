import Ember from 'ember';
/* global loadImage */

const {get, set, setProperties, computed, isBlank, isPresent} = Ember;

export default Ember.Component.extend({
  originalImageFile: null,
  originalImageUrl: null,
  displayImage: true,
  replacingImage: false,
  imageType: 'image/jpeg',
  hasNewImage: false,

  // Image validation properties
  minWidth: 200,
  minHeight: 200,

  // To be passed in as a closure action for receiving the new image
  onImageUpdate(){},

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

  editExistingFile: Ember.on('didInsertElement', function () {
    const image = get(this, 'image');
    if (Ember.isPresent(image)) {
      this.loadImageFile(image);
    } else {
      const file = this.get('originalImageFile');
      if (Ember.isPresent(file)) {
        this.loadImageFile(file);
      }
    }
  }),

  validateCanvasDimensions(canvas) {
    const $canvas = Ember.$(canvas);
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

    loadImage(file, (canvas) => {
      if (this.validateCanvasDimensions(canvas)) {
        this._saveCanvas(canvas, get(file, 'type'));
      }
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

    canvas.toBlob((data) => {
      this.set('image', data);
      this.onImageUpdate(data);
    }, imageType, blobQuality);
  },

  actions: {
    rotateImage(direction) {
      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
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
      this.setProperties({
        originalImageFile: null,
        originalImageUrl: null,
        imageUrl: null,
        replacingImage: true
      });
    }
  }
});
