import Ember from 'ember';
/* global loadImage */

const { computed, get, isPresent } = Ember;

export default Ember.Component.extend({
  originalImageFile: null,
  displayCropper: true,
  aspectRatio: 1,

  // Display the JS image cropping tool if the user has attached an image
  displayJSCropper: computed('displayCropper', 'originalImageFile', function() {
    const displayCropper = get(this, 'displayCropper');
    const hasOriginalFile = isPresent(get(this, 'originalImageFile'));

    return displayCropper && hasOriginalFile;
  }),

  initAttachFile: Ember.on('didInsertElement', function() {
    this.$('input[type=file]').on('change', (e) => {
      const file = this.$(e.target).context.files[0];

      // Store the original file on the model so we can access it later
      this.set('originalImageFile', file);

      // Use the "JavaScript Load Image" functionality to parse the file data
      // and get the correct orientation setting from the EXIF Data. This
      // addresses rotation issues with photos taken from mobile devices where
      // the meta data contains the orientation.
      this.loadImageFile(file);
    });
  }),

  removeChangeEvent: function() {
    this.$('input[type=file]').off('change');
  }.on('willDestroyElement'),

  editExistingFile: Ember.on('didInsertElement', function() {
    const file = this.get('originalImageFile');

    if (Ember.isPresent(file)) {
      this.loadImageFile(file);
    }
  }),

  // TODO: Split out into a separate avatar cropper.
  //
  // Currently only used by the dashboard avatar cropper. This component is not
  // destroyed in that case, and the unbindAttachFile() callback isn't triggered
  // to destroy the cropper. This results in the cropper remaining on the page
  // and causing issues on mobile browsers where the crop() callback is called
  // anytime you touch the screen.
  didUpdateAttrs(attrs) {
    const nowDisplayed = attrs.newAttrs.displayCropper.value;
    const wasDisplayed = attrs.oldAttrs.displayCropper.value;
    const wasRemoved = wasDisplayed && !nowDisplayed;
    const wasAdded = !wasDisplayed && nowDisplayed;

    if (wasRemoved) {
      this.unbindAttachFile();
    } else if (wasAdded) {
      this.initAttachFile();
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

      loadImage(file, (canvas) => { this.setupCropper(canvas); }, options);
    });
  },

  unbindAttachFile: Ember.on('willDestroyElement', function() {
    this.$('.js-Cropper-image').cropper('destroy');
    this.$('input[type=file]').off('change');
  }),

  setupCropper(canvas) {
    const blobFormat = this.get('originalImageFile.type');
    const imgDataURL = canvas.toDataURL(blobFormat);
    const img = this.$('.js-Cropper-image').attr('src', imgDataURL);
    const aspectRatio = this.get('aspectRatio');

    // The .cropper-container element is added by the cropper plugin, so we
    // can use that to detect if has already been initialized. If it has,
    // we just need to replace the image rather than reinitialize it.
    const cropperExists = Ember.isPresent(this.$('.cropper-container'));

    if (!cropperExists) {
      const that = this;

      img.cropper({
        aspectRatio: aspectRatio,

        // Run whenever the cropping area is adjusted
        crop() {
          Ember.run.debounce(that, that.cropUpdated, img, 100);
        }
      });
    } else {
      img.cropper('replace', imgDataURL);
    }
  },

  cropUpdated(img) {
    const blobFormat = this.get('originalImageFile.type');

    const url = img.cropper('getCroppedCanvas').toDataURL(blobFormat);

    this.set('imageUrl', url);

    const blobQuality = 0.9;

    img.cropper('getCroppedCanvas').toBlob((data) => {
      this.set('image', data);
    }, blobFormat, blobQuality);
  }
});
