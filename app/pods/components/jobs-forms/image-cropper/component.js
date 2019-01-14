import { debounce, next } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';

export default Component.extend({
  classNames: ['JobsForms-ImageCropper'],

  originalImage: null,
//  originalImageUrl: null,
  _croppedImageUrl: null,
  _croppedImage: null,
  imageType: 'image/jpeg',

  // JsCropper properties
  //aspectRatio: 1,
  zoomable: false,
  minWidth: 200,
  minHeight: 200,

  didInsertElement() {
    this._super(...arguments);
    const originalImageUrl = get(this, 'originalImage.imageUrl');
    this.initializeCropper(originalImageUrl);
  },

  willDestroyElement() {
    this.$('.js-Cropper-image').cropper('destroy');
    this._super(...arguments);
  },

  validateDimensions(img) {
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');

    const canvas = img.cropper('getCroppedCanvas');
    let width = canvas.getAttribute('width');
    let height = canvas.getAttribute('height');

    let enforceRequiredDimensions = false;

    if (width < minWidth) {
      width = minWidth;
      enforceRequiredDimensions = true;
    }

    if (height < minHeight) {
      height = minHeight;
      enforceRequiredDimensions = true;
    }

    if (enforceRequiredDimensions) {
      img.cropper('setCanvasData', {
        left: 0,
        top: 0,
        width,
        height
      });
      return false;
    }

    return true;
  },

  initializeCropper(imageUrl) {
    //const aspectRatio = this.get('aspectRatio');
    const zoomable = this.get('zoomable');
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');
    const that = this;

    const img = this.$('.js-Cropper-image')
      .attr('src', imageUrl)
      .one('load', () => {
        // The .cropper-container element is added by the cropper plugin, so we
        // can use that to detect if has already been initialized. If it has,
        // we just need to replace the image rather than reinitialize it.
        const cropperExists = isPresent(this.$('.cropper-container'));

        if (!cropperExists) {
          img.cropper({
            //aspectRatio: aspectRatio,
            zoomable: zoomable,
            scalable: false,
            zoomTo: 1,
            viewMode: 3,

            minCropBoxHeight: minHeight,
            minCropBoxWidth: minWidth,

            // Run whenever the cropping area is adjusted
            crop() {
              debounce(that, that.cropUpdated, img, 100);
            },
          });
        } else {
          img.cropper('replace', imageUrl);
        }

        this.cropUpdated(img);
      });
  },

  cropUpdated(img) {
    if (! get(this, 'isDestroyed')) {

      if (this.validateDimensions(img)) {
        const canvas = img.cropper('getCroppedCanvas');
        const blobFormat = get(this, 'imageType');
        // Broken images fail to make real canvas html element
        // canvas.toDataURL fails if canvas not html element and breaks cropper
        if (canvas.tagName) {
          const url = canvas.toDataURL(blobFormat);
          const blobQuality = 0.9;

          set(this, '_croppedImageUrl', url);

          canvas.toBlob((data) => {
            set(this, '_croppedImage', data);
          }, blobFormat, blobQuality);
        } else {
          // most likely a broken image
          next(() => {
            this.send('delete', img);
          });
        }
      }
    }
  },

  _resetImages() {
    setProperties(this, {
      _croppedImage: null,
      _croppedImageUrl: null
    });
  },

  actions: {
    rotateImage(direction) {
      const rotation = direction === 'left' ? -90 : 90;

      this.$('.js-Cropper-image').cropper("rotate", rotation);
    },

    cancel() {
      this._resetImages();

      if (get(this, 'onCancel')) {
        get(this, 'onCancel')();
      }
    },

    save() {
      if (get(this, 'onSave')) {
        get(this, 'onSave')({
          croppedImage: get(this, '_croppedImage'),
          croppedImageUrl: get(this, '_croppedImageUrl')
        });
      }
    },

    delete() {
      this._resetImages();

      if (get(this, 'onDelete')) {
        get(this, 'onDelete')();
      }

      this.$('.js-Cropper-image').cropper('destroy');
    },

    onCloseModal() {
      if (get(this, 'onCloseModal')) {
        get(this, 'onCloseModal')();
      }
    }
  }
});
