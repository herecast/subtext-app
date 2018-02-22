import Ember from 'ember';
import DS from 'ember-data';

const {
  inject: { service },
  RSVP,
  computed,
  get,
  isPresent
} = Ember;

export default Ember.Mixin.create({
  api: service(),

  images: DS.hasMany('image', { async: false }),
  populatedImages: computed('images.@each.{imageUrl,_delete}', function() {
    return get(this, 'images').rejectBy('_delete')
      .filter((image) => isPresent(get(image, 'imageUrl')));
  }),

  imageUrl: computed.alias('primaryOrFirstImage.imageUrl'),


  primaryImage: computed('populatedImages.@each.primary', function() {
    return get(this, 'populatedImages').findBy('primary');
  }),
  primaryImageUrl: computed.oneWay('primaryImage.imageUrl'),
  primaryImageCaption: computed.oneWay('primaryImage.caption'),


  primaryOrFirstImage: computed('populatedImages.@each.imageUrl', 'primaryImage.imageUrl', function() {
    const images = get(this, 'populatedImages');
    const primaryImage = get(this, 'primaryImage');

    return primaryImage || get(images, 'firstObject');
  }),

  save() {
    const imagesToSave = get(this, 'images')
      .filterBy('hasDirtyAttributes');

    const imagesToDelete = get(this, 'images').filterBy('_delete');

    return this._super().then(() => {
      imagesToSave.setEach('contentId', get(this, 'id'));

      let position = 1;
      const savedImages = imagesToSave.map((image) => {
        if(!image.get('_delete') &&
            (image.get('id') || image.get('file'))) {
          image.position = position;
          position = position + 1;
          return image.save();
        }
      });

      const deletedImages = imagesToDelete.map((image) => {
        return image.destroyRecord();
      });

      const allImages = savedImages.concat(deletedImages);

      return RSVP.all(allImages).then(() => {
        // Clean up any images build for the form, or that did not save
        this.rollbackImages();
        return this;
      });
    });
  },

  rollbackImages() {
    get(this, 'images').forEach((image) => {
      if(!get(image, 'id')) {
        image.rollbackAttributes();
      }
    });
  }
});
