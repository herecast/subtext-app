import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  setProperties,
  set
} = Ember;

export default Ember.Component.extend(TestSelector, {
  isAddingNewImage: false,

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
    setProcessingStatus(status) {
      // need to display a spinner as this operation
      // can be lengthy on some low power devices
      if (status === 'start') {
        set(this, 'isAddingNewImage', true);
      } else if (status === 'end' || status === null) {
        set(this, 'isAddingNewImage', false);
      }
    },

    imageError(e) {
      set(this, 'error', e.message);
    }
  }
});
