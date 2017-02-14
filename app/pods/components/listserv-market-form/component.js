import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Component.extend({
  actions: {
    afterDetails() {
      this.attrs.doneEditing();
    },
    addImage(image) {
      const images = get(this, 'model.images');
      if(!images.rejectBy('_delete').isAny('primary')) {
        image.set('primary', true);
      }
      images.pushObject(image);
    },
    removeImage(image) {
      set(image, '_delete', true);
    },
    setPrimary(image) {
      get(this, 'model.images').setEach('primary', false);
      set(image, 'primary', true);
    }
  }
});
