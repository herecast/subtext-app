import Ember from 'ember';
/* global loadImage */

const { computed, get, set, isPresent } = Ember;

export default Ember.Component.extend({
  originalImageFile: null,
  originalImageUrl: null,
  displayCropper: true,

  // JsCropper properties
  aspectRatio: 1,
  zoomable: true,
  minWidth: 200,
  minHeight: 200,

  // Display the JS image cropping tool if the user has attached an image
  displayJSCropper: computed('displayCropper', 'originalImageFile', 'originalImageUrl', function() {
    const displayCropper = get(this, 'displayCropper');
    const hasOriginalFile = isPresent(get(this, 'originalImageFile'));

    return displayCropper && (hasOriginalFile || get(this, 'originalImageUrl'));
  }),

  editExistingFile: Ember.on('didInsertElement', function() {
    const file = this.get('originalImageFile');

    if (Ember.isPresent(file)) {
      this.loadImageFile(file);
    } else if (get(this, 'originalImageUrl')) {
      this.initializeCropper(get(this, 'originalImageUrl'));
    }
  }),

  // TODO: Split out into a separate avatar cropper.
  //
  // This component is not destroyed in that case, and the unbindAttachFile()
  // callback isn't triggered to destroy the cropper. This results in the cropper
  // remaining on the page and causing issues on mobile browsers where the crop()
  // callback is called anytime you touch the screen.
  didUpdateAttrs(attrs) {
    if (attrs.newAttrs.displayCropper) {
      const nowDisplayed = attrs.newAttrs.displayCropper.value;
      const wasDisplayed = attrs.oldAttrs.displayCropper.value;
      const wasRemoved = wasDisplayed && !nowDisplayed;

      if (wasRemoved) {
        this.unbindAttachFile();
      }
    }
 },

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
    loadImage.parseMetaData(file, (data) => {

      const options = {
        canvas: true,

        // For cropping performance, this reduces the image file size
        // before opening the cropper.
        maxWidth: 1000
      };

      if (data.exif) {
        options.orientation = data.exif.get('Orientation');
      }

      loadImage(file, (canvas) => {
        if (this.validateCanvasDimensions(canvas)) {
          this.setupCropper(canvas);
        }
      }, options);
    });
  },

  unbindAttachFile: Ember.on('willDestroyElement', function() {
    this.$('.js-Cropper-image').cropper('destroy');
  }),

  setupCropper(canvas) {
    const blobFormat = this.get('originalImageFile.type');
    const imgDataURL = canvas.toDataURL(blobFormat);
    this.initializeCropper(imgDataURL);
  },

  initializeCropper(imageUrl) {
    const aspectRatio = this.get('aspectRatio');
    const zoomable = this.get('zoomable');
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');
    const that = this;

    const img = this.$('.js-Cropper-image').attr('src', imageUrl);

    // The .cropper-container element is added by the cropper plugin, so we
    // can use that to detect if has already been initialized. If it has,
    // we just need to replace the image rather than reinitialize it.
    const cropperExists = Ember.isPresent(this.$('.cropper-container'));

    if (!cropperExists) {
      img.cropper({
        aspectRatio: aspectRatio,
        zoomable: zoomable,

        minCropBoxHeight: minHeight,
        minCropBoxWidth: minWidth,

        maxCropBoxWidth: 1000,

        // Run whenever the cropping area is adjusted
        crop() {
          Ember.run.debounce(that, that.cropUpdated, img, 100);
        }
      });
    } else {
      img.cropper('replace', imageUrl);
    }

    // Just in case we need to wait for the image to load
    img.on('load', function() {
      Ember.run.later(that, () => { that.cropUpdated(img); }, 500);
    });

    // Ensure it runs at least once after initialize
    Ember.run.later(this, () => { this.cropUpdated(img); }, 500);
  },

  cropUpdated(img) {
    const canvas = img.cropper('getCroppedCanvas');

    if (this.validateCanvasDimensions(canvas)) {
      const blobFormat = this.get('originalImageFile.type');
      const url = canvas.toDataURL(blobFormat);
      const blobQuality = 0.9;

      this.set('imageUrl', url);

      canvas.toBlob((data) => {
        this.set('image', data);
      }, blobFormat, blobQuality);
    }
  },

  actions: {
    filesSelected(files) {
      const file = files[0];

      set(this, 'error', null);

      // Store the original file on the model so we can access it later
      this.set('originalImageFile', file);

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
    }
  }
});
