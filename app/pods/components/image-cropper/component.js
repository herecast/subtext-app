import { debounce, next } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { set, get } from '@ember/object';
import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['ImageCropper'],

  imageUrl: null,
  imageType: 'image/jpeg',

  // JsCropper properties
  aspectRatio: 1,
  zoomable: false,
  minWidth: 200,
  minHeight: 200,

  didInsertElement() {
    this._super(...arguments);
    const imageUrl = get(this, 'imageUrl');
    this.initializeCropper(imageUrl);
  },

  willDestroyElement() {
    $(this.element).find('.js-Cropper-image').cropper('destroy');
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
    const aspectRatio = this.get('aspectRatio');
    const zoomable = this.get('zoomable');
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');
    const that = this;

    const img = $(this.element).find('.js-Cropper-image')
      .attr('src', imageUrl)
      .one('load', () => {
        // The .cropper-container element is added by the cropper plugin, so we
        // can use that to detect if has already been initialized. If it has,
        // we just need to replace the image rather than reinitialize it.
        const cropperExists = isPresent($(this.element).find('.cropper-container'));

        if (!cropperExists) {
          img.cropper({
            aspectRatio: aspectRatio,
            zoomable: zoomable,
            scalable: false,
            zoomTo: 1,
            viewMode: 3,

            minCropBoxHeight: minHeight,
            minCropBoxWidth: minWidth,

            maxCropBoxWidth: 1000,

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

          set(this, 'imageUrl', url);

          canvas.toBlob((data) => {
            set(this, 'image', data);
          }, blobFormat, blobQuality);
        } else {
          // most likely a broken image
          next(() => {
            this.send('deleteImage', img);
          });
        }
      }
    }
  },

  actions: {
    rotateImage(direction) {
      const rotation = direction === 'left' ? -90 : 90;

      $(this.element).find('.js-Cropper-image').cropper("rotate", rotation);
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
