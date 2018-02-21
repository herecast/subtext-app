import Ember from 'ember';
import DS from 'ember-data';

const {
  inject: { service },
  RSVP,
  computed,
  get,
  isPresent
} = Ember;

const { attr } = DS;

export default Ember.Mixin.create({
  api: service(),

  images: DS.hasMany('image', { async: false }),

  // @TODO remove
  // The following fields are only present for events,
  // and should be removed once events handle multiple
  // images.
  imageUrl: attr('string'),
  imageWidth: attr('string'),
  imageHeight: attr('string'),

  // Populated images filter is here because there are times when
  // the image-upload component can set a null value to imageUrl
  populatedImages: computed('images.@each.imageUrl', function() {
    return get(this, 'images')
      .filter((image) => isPresent(get(image, 'imageUrl')));
  }),

  // TAG:NOTE image handling should be stanardized. Notes on this sent to JohnO ~cm
  // Different for news..  Do not use the current primary image implementation with imageUrl
  bannerImage: computed('images.@each.primary', function() {
    return get(this, 'images').findBy('primary', 1);
  }),
  featuredImageWidth: computed.oneWay('bannerImage.width'),
  featuredImageHeight: computed.oneWay('bannerImage.height'),
  featuredImageUrl: computed.oneWay('bannerImage.imageUrl'),
  featuredImageCaption: computed.oneWay('bannerImage.caption'),

  primaryImageUrl: computed.oneWay('primaryImage.imageUrl'),
  primaryImageCaption: computed.oneWay('primaryImage.caption'),

  primaryImage: computed('images.@each.{imageUrl,primary}', 'imageUrl', function() {
    const primaryImage = get(this, 'images').find(image => {
      return get(image, 'primary') === 1;
    });

    return isPresent(primaryImage) ? primaryImage : {imageUrl: get(this, 'imageUrl'), caption: null};
  }),

  coverImageUrl: computed('populatedImages.@each.{primary,imageUrl}', 'imageUrl', function() {
    const images = get(this, 'populatedImages');
    const primaryImage = images.findBy('primary');

    // For legacy data where the primary flag may not be set, fall back to
    // the first image.
    const image = primaryImage || get(images, 'firstObject');

    if (image) {
      return get(image, 'imageUrl');
    } else {
      return get(this, 'imageUrl');
    }
  }),


  // @TODO remove once events support multiple images
  uploadImage(image) {
    const data = new FormData();

    data.append('image[primary]', true);
    data.append('image[image]', image);
    data.append('image[content_id]', get(this, 'id'));

    return get(this, 'api').upsertImage(data);
  },

  save() {
    const imagesToSave = get(this, 'images')
      .filterBy('hasDirtyAttributes')
      .filterBy('imageUrl');

    const imagesToDelete = get(this, 'images').filterBy('_delete');

    return this._super().then(() => {
      imagesToSave.setEach('contentId', get(this, 'id'));

      let position = 1;
      const savedImages = imagesToSave.map((image) => {
        if(!image.get('_delete')) {
          image.position = position;
          position = position + 1;
          return image.save();
        }
      });

      const deletedImages = imagesToDelete.map((image) => {
        return image.destroyRecord();
      });

      const allImages = savedImages.concat(deletedImages);

      // Single image
      // @TODO remove once event has multiple images
      if(this.get('image')) {
        allImages.push(this.uploadImage(get(this, 'image')));
      }

      return RSVP.all(allImages).then(() => {
        // Clean up any images build for the form, or that did not save
        this.rollbackImages();
        return this;
      });
    });
  },

  rollbackImages() {
    get(this, 'images').forEach((image) => {
      if(!image.get('id')) {
        image.rollbackAttributes();
      }
    });
  }
});
