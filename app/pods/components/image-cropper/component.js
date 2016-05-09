import Ember from 'ember';

const {
  get,
  on
} = Ember;

export default Ember.Component.extend({
  classNames: ['ImageCropper'],

  canvas: null,
  type: null,
  minWidth: 200,
  minHeight: 200,

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  resetProperties() {
    this.setProperties({
      image: null,
      imageUrl: null
    });
  },

  unbindAttachFile: on('willDestroyElement', function() {
    this.$('.js-Cropper-image').cropper('destroy');
  }),

  setupCropper: on('didInsertElement', function() {
    const canvas = get(this, 'canvas');

    if (canvas) {
      const blobFormat = get(this, 'type');
      const imgDataURL = canvas.toDataURL(blobFormat);
      const img = this.$('.js-Cropper-image').attr('src', imgDataURL);
      const aspectRatio = this.get('aspectRatio');
      const minHeight = get(this, 'minHeight');
      const minWidth = get(this, 'minWidth');

      // The .cropper-container element is added by the cropper plugin, so we
      // can use that to detect if has already been initialized. If it has,
      // we just need to replace the image rather than reinitialize it.
      const cropperExists = Ember.isPresent(this.$('.cropper-container'));

      if (!cropperExists) {
        const that = this;

        Ember.run(() => {
          img.cropper({
            aspectRatio: aspectRatio,
            minCropBoxHeight: minHeight,
            minCropBoxWidth: minWidth,

            // Run whenever the cropping area is adjusted
            crop() {
              Ember.run.debounce(that, that.cropUpdated, img, 100);
            }
          });
        });
      } else {
        img.cropper('replace', imgDataURL);
      }
    }
  }),

  cropUpdated(img) {
    const blobFormat = get(this, 'type');
    const url = img.cropper('getCroppedCanvas').toDataURL(blobFormat);
    this.set('imageUrl', url);

    const blobQuality = 0.9;

    img.cropper('getCroppedCanvas').toBlob((data) => {
      this.set('image', data);
    }, blobFormat, blobQuality);
  },

  actions: {
    save() {
      const image = get(this, 'image');
      const imageUrl = get(this, 'imageUrl');

      this.attrs.updateImage(image, imageUrl);
    },

    cancel() {
      this.attrs.cancel();
    }
  }
});
