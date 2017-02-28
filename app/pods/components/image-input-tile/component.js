import Ember from 'ember';

const {
  set,
  get,
  RSVP: {Promise}
} = Ember;

export default Ember.Component.extend({
  accept: "image/jpeg,image/gif,image/png",
  classNames: ['ImageInputTile'],
  multiple: false,
  minHeight: 200,
  minWidth: 200,
  errors: [],

  fileError(e) {
    if ('notifyProcessing' in this.attrs) {
      this.attrs.notifyProcessing('end');
    }

    if('onError' in this.attrs) {
      this.attrs.onError(e);
    } else {
      get(this, 'errors').push(e.message);
      throw(e);
    }
  },

  fileSuccess({file, img}) {
    this.attrs.action({file, img});

    if ('notifyProcessing' in this.attrs) {
      this.attrs.notifyProcessing('end');
    }
  },

  processFile(file) {
    if ('notifyProcessing' in this.attrs) {
      this.attrs.notifyProcessing('start');
    }

    return new Promise((resolve, reject) => {
      const minWidth = get(this, 'minWidth');
      const minHeight = get(this, 'minHeight');
      const reader = new FileReader();

      if(/image\/.+/.test(file.type)) {
        reader.onload = (e) => {
          const img = new Image();

          img.onload = () => {
            if(img.width >= minWidth && img.height >= minHeight) {
              resolve({file, img});
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

      if(get(this, 'multiple')) {
        for(var i=0; i < files.length; i++) {
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
