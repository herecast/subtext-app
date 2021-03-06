import { get, set, computed } from '@ember/object';
import { notEmpty, oneWay, readOnly, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  fastboot: service(),
  history: service(),

  model: null,
  isPreview: false,

  isFirstRoute: readOnly('history.isFirstRoute'),

  thumbSortDefinition: Object.freeze(['primary:desc']),

  hasCaption: notEmpty('model.primaryImageCaption'),

  activeImageUrl: oneWay('model.primaryOrFirstImage.imageUrl'),

  images: readOnly('model.images'),
  sortedImages: sort('visibleImages', 'thumbSortDefinition'),
  visibleImages: computed('images.@each._delete', function() {
    const images = get(this, 'images') || [];

    return images.rejectBy('_delete');
  }),

  showThumbnails: computed('visibleImages.[]', 'model.isNews', function() {
    return !get(this, 'model.isNews') && get(this, 'visibleImages.length') > 1;
  }),

  actions: {
    chooseImage(imageUrl) {
      set(this, 'activeImageUrl', imageUrl);
    }
  }
});
