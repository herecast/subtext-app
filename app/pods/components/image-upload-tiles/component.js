import Ember from 'ember';

const {
  get,
  set,
  setProperties,
  computed,
  inject
} = Ember;

export default Ember.Component.extend({
  store: inject.service('store'),
  minWidth: 200,
  minHeight: 200,
  processingFile: false,
  nonDeletedImages: computed.filterBy('images', '_delete', undefined),

  addImage(img) {
    const image = get(this, 'store').createRecord('image', {
      imageUrl: img.src,
      width: img.width,
      height: img.height
    });

    const images = get(this, 'images');

    if(!images.rejectBy('_delete').isAny('primary')) {
      image.set('primary', true);
    }
    images.pushObject(image);
  },

  removeImage(image) {
    set(image, '_delete', true);
  },

  setPrimary(image) {
    get(this, 'images').setEach('primary', false);
    set(image, 'primary', true);
  },

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


  actions: {
    filesSelected(files) {
      set(this, 'error', null);

      for(var i=0; i < files.length; i++) {
        this.handleFile(files[i]);
      }
    }
  }
});
