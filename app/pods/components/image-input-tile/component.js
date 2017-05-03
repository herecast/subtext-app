import Ember from 'ember';
/* global loadImage, atob, ArrayBuffer, Uint8Array */

const {
  set,
  get,
  RSVP: {Promise}
} = Ember;

function scaleDimensionsToFit(img, maxDimension) {
  let width, height;

  if (img.width > maxDimension && img.height > maxDimension) {
    if (img.width >= img.height) {
      width = maxDimension;
      height = img.height * (maxDimension/img.width);
    } else {
      height = maxDimension;
      width = img.width * (maxDimension/img.height);
    }
  } else if (img.width > maxDimension) {
    width = maxDimension;
    height = img.height * (maxDimension/img.width);
  } else if (img.height > maxDimension) {
    height = maxDimension;
    width = img.width * (maxDimension/img.height);
  } else {
    height = img.height;
    width = img.width;
  }

  return { width, height };
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

export default Ember.Component.extend({
  accept: "image/jpeg,image/gif,image/png",
  classNames: ['ImageInputTile'],
  multiple: false,
  minHeight: 200,
  minWidth: 200,
  maxDimension: 2000,
  errors: [],

  // this is here for testing purposes
  _isProcessing: null,

  init() {
    this._super(...arguments);

    if (Ember.testing) {
      this._isProcessing = false;
      Ember.Test.registerWaiter(() => this._isProcessing === false);
    }
  },

  fileError(e) {
    if(get(this, 'notifyProcessing')) {
      get(this, 'notifyProcessing')('end');
    }


    set(this, '_isProcessing', false);

    if (get(this, 'onError')) {
      get(this, 'onError')(e);

    } else {
      get(this, 'errors').push(e.message);
      throw(e);
    }
  },

  fileSuccess({file, img}) {
    get(this, 'action')({file, img});

    set(this, '_isProcessing', false);

    if (get(this, 'notifyProcessing')) {
      get(this, 'notifyProcessing')('end');
    }
  },

  processFile(file) {
    if (get(this, 'notifyProcessing')) {
      get(this, 'notifyProcessing')('start');
    }

    set(this, '_isProcessing', true);

    return new Promise((resolve, reject) => {
      if (!/image\/.+/.test(file.type)) {
        reject(new Error(
          'File must be an image'
        ));
        return;
      }

      const minWidth = get(this, 'minWidth');
      const minHeight = get(this, 'minHeight');
      const maxDimension = get(this, 'maxDimension');

      loadImage(
        file,
        (canvas) => {
          if (canvas.width < minWidth || canvas.height < minHeight) {
            reject(new Error(`Image must have minimum dimensions of ${minWidth}x${minHeight}`));
          }

          // store the original image data so we can re-render it
          // into the resized canvas
          const originalImage = new Image();
          originalImage.src = canvas.toDataURL("image/png");

          originalImage.onload = () => {
            // resize the canvas, re-render the original image data
            // into the re-sized canvas
            const { width, height } = scaleDimensionsToFit(canvas, maxDimension);
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImage, 0, 0, width, height);

            // and finally, we create a new image so that we
            // can resolve with the final image data
            const image = new Image();
            image.src = canvas.toDataURL('image/jpeg', 0.8);

            image.onerror = reject;

            image.onload = () => {
              resolve({
                file: dataURItoBlob(image.src),
                img: image
              });
            };
          };
        }, {
          orientation: true,
          canvas: true
        }
      );
    });
  },

  actions: {
    filesSelected(files) {
      set(this, 'errors', []);

      if (get(this, 'multiple')) {
        for (var i=0; i < files.length; i++) {
          this.processFile(files[i]).then(
            (d) => this.fileSuccess(d),
            (e) => this.fileError(e)
          );
        }
      } else {
        this.processFile(files[0]).then(
          (d) => this.fileSuccess(d),
          (e) => this.fileError(e)
        );
      }
    }
  }
});
