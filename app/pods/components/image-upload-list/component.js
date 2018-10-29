import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isPresent, isEmpty } from '@ember/utils';
import { set, get, computed } from '@ember/object';

export default Component.extend({
  store: service(),
  model: null,

  imageLimit: 6,
  imageLimitReached: computed('imageLImit', 'visibleImages.[]', function() {
    const limit = get(this, 'imageLimit');
    return get(this, 'visibleImages').length >= limit;
  }),

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  images: alias('model.images'),

  visibleImages: computed('images.@each._delete', function() {
    const images = get(this, 'images');

    return images.rejectBy('_delete');
  }),

  resetProperties() {
    const images = get(this, 'images');

    if (isEmpty(images)) {
      const initialImage = get(this, 'store').createRecord('image', {
        primary: true
      });

      set(this, 'images', [initialImage]);
    }
  },

  actions: {
    addImage() {
      const images = get(this, 'images').rejectBy('_delete');
      let primary = false;
      if(isEmpty(images)) {
        primary=true;
      }

      const newImage = get(this, 'store').createRecord('image', { primary: primary });

      get(this, 'images').pushObject(newImage);
    },

    removeImage(image) {
      const isPrimaryImage = get(image, 'primary');

      if (get(image, 'isNew')) {
        run(() => get(this, 'images').removeObject(image));
      } else {
        // If an image has already been persisted, reset imageUrl so it's
        // hidden from the page, and flag it with "_delete" so it will be
        // destroyed when the market post is saved.
        set(image, 'imageUrl', null);
        set(image, '_delete', true);
      }

      if (isPrimaryImage) {
        const firstImage = get(this, 'images')
          .filter((image) => isPresent(get(image, 'imageUrl')))
          .get('firstObject');

        if(firstImage) {
          set(firstImage, 'primary', true);
        }
      }

      this.resetProperties();
    },

    setPrimary(image) {
      get(this, 'images').setEach('primary', false);
      set(image, 'primary', true);
    }
  }
});
