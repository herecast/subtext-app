import Ember from 'ember';

const {
  get,
  set,
  setProperties,
  inject
} = Ember;

export default Ember.Component.extend({
  store: inject.service('store'),
  minWidth: 200,
  minHeight: 200,
  processingFile: false,
  removeImage() {/*to be overridden*/},
  setPrimary() {/*to be overridden*/},

  handleFile(file) {
    const minWidth = get(this, 'minWidth');
    const minHeight = get(this, 'minHeight');
    const reader = new FileReader();

    set(this, 'processingFile', true);

    if(Ember.testing) {
      Ember.Test.registerWaiter(() => {
        return get(this, 'processingFile') === false;
      });
    }

    if(/image\/.+/.test(file.type)) {
      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          Ember.run(()=>{
            if(img.width >= minWidth && img.height >= minHeight) {
              this.addImage(img);
            } else {
              set(this, 'error',
                `Image must have minimum dimensions of ${minWidth}x${minHeight}`);
            }

            set(this, 'processingFile', false);
          });
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      setProperties(this, {
        processingFile: false,
        error: 'File must be an image'
      });
    }
  },

  addImage(img) {
    const image = get(this, 'store').createRecord('image', {
      imageUrl: img.src,
      width: img.width,
      height: img.height
    });

    this.attrs.imageAdded(image);
  },

  actions: {
    filesSelected(files) {
      set(this, 'error', null);

      for(var i=0; i < files.length; i++) {
        this.handleFile(files[i]);
      }
    }
  }
});
