import { get, set, computed } from '@ember/object';
import { readOnly, alias, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import { run, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import Component from '@ember/component';
/* global loadImage */

export default Component.extend({
  classNames: 'JobsForms-ImageUpload',

  store: service(),

  model: null,
  minWidth: 200,
  minHeight: 200,
  maxNumberOfImages: 8,
  hasMaxImages: computed('images.[]', 'maxNumberOfImages', function() {
    return get(this, 'images.length') >= get(this, 'maxNumberOfImages');
  }),

  showImageEditor: false,
  isChoosingImage: false,

  editingImageFile: null,
  editingImageUrl: null,

  editingImage: null,
  imageBeingViewed: null,

  imageErrorMessage: null,

  init() {
    this._super(...arguments);
    if (get(this, 'hasPrimaryImage')) {
      set(this, 'imageBeingViewed', get(this, 'primaryImage'));
    }
  },

  images: alias('model.images'),
  primaryImage: readOnly('model.primaryImage'),
  hasPrimaryImage: notEmpty('primaryImage'),
  viewingPrimaryImage: readOnly('imageBeingViewed.primary'),
  visibleImages: computed('images.@each._delete', function() {
    const images = get(this, 'images');

    return images.rejectBy('_delete');
  }),
  otherImages: computed('images.@each.primary', function() {
    const images = get(this, 'visibleImages');
    return images.rejectBy('primary');
  }),
  hasOtherImages: notEmpty('otherImages'),

  _processImage(file) {
    const minHeight = get(this, 'minHeight');
    const minWidth = get(this, 'minWidth');
//https://github.com/blueimp/JavaScript-Load-Image
    return new Promise((resolve) => {
      loadImage.parseMetaData(file, () => {
        const options = {
          // Convert to a canvas object so that we can validate it
          canvas: true,

          // This reduces the image file size
          maxWidth: 1000,
          maxHeight: 1000
        };

        const maxFileSize = 9 * 1e6;
        // Because loadImage is asynchronous, when the canvas property is
        // changed, it triggers a function that updates the imageUrl on an image.
        loadImage(file, (canvas) => {
          run(() => {
            const $canvas = $(canvas);
            if ($canvas.attr('width') < minWidth || $canvas.attr('height') < minHeight) {
              set(this, 'imageErrorMessage', `Image must be at least ${minWidth}px wide by ${minHeight}px tall`);
              return false;
            } else if (parseInt(file.size) > maxFileSize) {
              const fileSize = (file.size / 1e6).toFixed(1) || 'Over 9';
              const fileName = file.name || 'Your image';
              const imageSizeErrorMessage = `${fileName} was ${fileSize}MB and must be under 9MB.`;

              set(this, 'imageErrorMessage', imageSizeErrorMessage);

              later(() => {
                if (!get(this, 'isDestroyed') && get(this, 'imageErrorMessage') === imageSizeErrorMessage) {
                  set(this, 'imageErrorMessage', null);
                }
              }, 5000);
              return false;
            } else {
              set(this, 'imageErrorMessage', null);
              const imageUrl = canvas.toDataURL(get(file, 'type'));

              this._addImage(file, imageUrl);

              resolve(imageUrl);
            }
          });
        }, options);
      });
    });
  },

  _addImage(file, imageUrl) {
    const images = get(this, 'images');
    let primary = false;
    if (isEmpty(images) || images.length === 0) {
      primary = true;
    }

    const newImage = get(this, 'store').createRecord('image', { primary });

    set(newImage, 'file', file);
    set(newImage, 'imageUrl', imageUrl);

    if (primary) {
      set(this, 'imageBeingViewed', newImage);
    }

    images.pushObject(newImage);
  },

  _uploadImage() {
    const $fileInput = $(get(this, 'element')).find('#featured-image-input input')[0];
    $fileInput.click();
  },

  actions: {
    uploadImage() {
      set(this, 'isChoosingImage', false);
      this._uploadImage();
    },

    imageSelected(filesList) {
      let filesArray = Array.from(filesList);

      const maxNumberOfImages = get(this, 'maxNumberOfImages');
      const images = get(this, 'images') || [];
      const numImagesAllowed = maxNumberOfImages - images.length;

      if (filesArray.length > numImagesAllowed) {
        filesArray = filesArray.slice(0, numImagesAllowed);
      }

      filesArray.forEach((file) => {
        this._processImage(file);
      });
    },

    showImageEditor() {
      set(this, 'showImageEditor', true);
    },
    hideImageEditor() {
      set(this, 'showImageEditor', false);
    },

    changeImageBeingViewed(image) {
      set(this, 'imageBeingViewed', image);
    },

    editImage() {
      const imageToEdit = get(this, 'imageBeingViewed');

      set(this, 'editingImage', imageToEdit);
      set(this, 'showImageEditor', true);

    },

    onCropperSave(imageObj) {
      const imageFile = imageObj.croppedImage;
      const imageUrl = imageObj.croppedImageUrl;
      const editingImage = get(this, 'editingImage');

      set(editingImage, 'file', imageFile);
      set(editingImage, 'imageUrl', imageUrl);

      set(this, 'editingImage', null);

      this.send('hideImageEditor');
    },

    onCropperCancel() {
      set(this, 'showImageEditor', false);
      set(this, 'editingImageUrl', null);
    },

    onCropperDelete() {
      set(this, 'showImageEditor', false);
      set(this, 'editingImageUrl', null);

      const editingImage = get(this, 'editingImage');

      if (get(editingImage, 'isNew')) {
        editingImage.unloadRecord();
      } else {
        set(editingImage, 'imageUrl', null);
        set(editingImage, '_delete', true);
      }

      if (get(this, 'visibleImages')) {
        get(this, 'visibleImages').forEach((image, index) => {
          set(image, 'primary', index === 0);
          set(image, 'position', index);
        });

        set(this, 'imageBeingViewed', get(this, 'primaryImage'));
      }
    },

    reorderThumbnails(reorderedImages, imageDragged) {
      reorderedImages.forEach((image, index) => {
        set(image, 'primary', index === 0);
        set(image, 'position', index);
      });

      set(this, 'images', reorderedImages);
      set(this, 'imageBeingViewed', imageDragged);
    }
  }
});
