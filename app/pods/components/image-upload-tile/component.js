import Ember from 'ember';

const {
  setProperties,
  computed,
  set
} = Ember;

export default Ember.Component.extend({
  // Override to handle in parent context
  addImage({img, file}) {
    setProperties(this, {
      'model.imageUrl': img.src,
      'model.image': file,
      error: null
    });
  },

  // Override to handle in parent context
  removeImage(image) {
    setProperties(this, {
      'model.imageUrl': null,
      'model.image': null,
      error: null
    });
  },

  actions: {
    imageError(e) {
      set(this, 'error', e.message);
    }
  }
});
