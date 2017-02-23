import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  setProperties,
  set
} = Ember;

export default Ember.Component.extend(TestSelector, {
  // Override to handle in parent context
  addImage({img, file}) {
    setProperties(this, {
      'model.imageUrl': img.src,
      'model.image': file,
      error: null
    });
  },

  // Override to handle in parent context
  removeImage() {
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
