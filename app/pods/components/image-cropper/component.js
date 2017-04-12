import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Component.extend({
  classNames: ['ImageCropper'],

  imageUrl: null,
  imageType: 'image/jpeg',

  // JsCropper properties
  aspectRatio: 1,
  zoomable: true,
  minWidth: 200,
  minHeight: 200,

  didInsertElement() {
    this._super(...arguments);
    const imageUrl = get(this, 'imageUrl');
    this.initializeCropper(imageUrl);
  },

  willDestroyElement() {
    this.$('.js-Cropper-image').cropper('destroy');
    this._super(...arguments);
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
    if (! get(this, 'isDestroyed')) {
      const canvas = img.cropper('getCroppedCanvas');

      if (this.validateCanvasDimensions(canvas)) {
        const blobFormat = get(this, 'imageType');
        // Broken images fail to make real canvas html element
        // canvas.toDataURL fails if canvas not html element and breaks cropper
        if (canvas.tagName) {
          const url = canvas.toDataURL(blobFormat);
          const blobQuality = 0.9;

          this.set('imageUrl', url);

          canvas.toBlob((data) => {
            this.set('image', data);
          }, blobFormat, blobQuality);
        } else {
          // most likely a broken image
          Ember.run.next(() => {
            this.send('deleteImage', img);
          });
        }
      }
    }
  },

  actions: {
    rotateImage(direction) {
      const rotation = direction === 'left' ? -90 : 90;

      this.$('.js-Cropper-image').cropper("rotate", rotation);
    },

    cancel() {
      this.setProperties({
        image: null,
        imageUrl: null,
      });
    },

    deleteImage(img) {
      this.send('cancel');
      img.cropper('destroy');
    }
  }
});
