import Ember from 'ember';
/* global EXIF, atob, ArrayBuffer, Uint8Array */

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

  fileError(e) {
    if(get(this, 'notifyProcessing')) {
      get(this, 'notifyProcessing')('end');
    }

    if (get(this, 'onError')) {
      get(this, 'onError')(e);
    } else {
      get(this, 'errors').push(e.message);
      throw(e);
    }
  },

  fileSuccess({file, img}) {
    get(this, 'action')({file, img});

    if (get(this, 'notifyProcessing')) {
      get(this, 'notifyProcessing')('end');
    }
  },

  processFile(file) {
    if (get(this, 'notifyProcessing')) {
      get(this, 'notifyProcessing')('start');
    }

    return new Promise((resolve, reject) => {
      const minWidth = get(this, 'minWidth');
      const minHeight = get(this, 'minHeight');
      const reader = new FileReader();

      if (/image\/.+/.test(file.type)) {
        reader.onload = (e) => {
          const img = new Image();
          const maxDimension = get(this, 'maxDimension');

          img.onload = () => {
            if (img.width >= minWidth && img.height >= minHeight) {
              const canvas = document.createElement('canvas');
              let srcOrientation;

              EXIF.getData(img, function() {
                const allMetaData = EXIF.getAllTags(this);
                srcOrientation = allMetaData['Orientation'] || null;

                const { width, height } = scaleDimensionsToFit(img, maxDimension);

                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // transform context before drawing image
                switch(srcOrientation) {
                  case 2:
                    // horizontal flip
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    break;
                  case 3:
                    // 180° rotate left
                    ctx.translate(canvas.width, canvas.height);
                    ctx.rotate(Math.PI);
                    break;
                  case 4:
                    // vertical flip
                    ctx.translate(0, canvas.height);
                    ctx.scale(1, -1);
                    break;
                  case 5:
                    // vertical flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                  case 6:
                    // 90° rotate right
                    canvas.width = height;
                    canvas.height = width;
                    canvas.getContext("2d").rotate(0.5 * Math.PI);
                    canvas.getContext("2d").translate(0, -canvas.width);
                    break;
                  case 7:
                    // horizontal flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(canvas.width, -canvas.height);
                    ctx.scale(-1, 1);
                    break;
                  case 8:
                    // 90° rotate left
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-canvas.height, 0);
                    break;
                }

                ctx.drawImage(img, 0, 0, width, height);

                const newImage = new Image();
                newImage.width = width;
                newImage.height = height;
                newImage.src = canvas.toDataURL('image/jpeg', 0.8);

                resolve({
                  file: dataURItoBlob(newImage.src),
                  img: newImage
                });
              });
            } else {
             reject(new Error(`Image must have minimum dimensions of ${minWidth}x${minHeight}`));
            }
          };

          img.onerror = reject;

          img.src = e.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        reject(new Error(
          'File must be an image'
        ));
      }
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
