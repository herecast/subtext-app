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
  eventId: attr('number'),
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
  bannerImage: computed.alias('primaryImage'),
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
  uploadEventImage() {
    const event_id = get(this, 'eventId');
    const api = get(this, 'api');
    const data = new FormData();

    if (this.get('image')) {
      data.append('event[image]', this.get('image'));

      return api.updateEventImage(event_id, data);
    }
  },
  uploadTalkImage() {
    if (get(this, 'image')) {
      const api = get(this, 'api');
      const data = new FormData();

      data.append('talk[image]', get(this, 'image'));

      return api.updateTalkImage(get(this, 'id'), data);
    }
  },

  save() {
    const imagesToSave = get(this, 'images').filterBy('imageUrl');
    const imagesToDelete = get(this, 'images').filterBy('_delete');

    return this._super().then((post) => {
      imagesToSave.setEach('contentId', get(post, 'id'));

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
      if(post.get('image')) {
        if(post.get('contentType') === 'talk') {
          allImages.push(post.uploadTalkImage());
        } else if(post.get('contentType') === 'event') {
          allImages.push(post.uploadEventImage());
        }
      }

      return RSVP.all(allImages);
    });
  },

  saveWithImages() {
    this.save();
  },

  rollbackImages() {
    get(this, 'images').forEach(image => image.rollbackAttributes());
  }
});
