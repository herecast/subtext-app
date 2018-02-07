import Ember from 'ember';
import DS from 'ember-data';
import Content from 'subtext-ui/mixins/models/content';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';

const {
  computed,
  get,
  isPresent,
  RSVP
} = Ember;

export default DS.Model.extend(FastbootExtensions, Content, {
  // NOTE:this model does not have 'authorId'
  // NOTE:this model does not have 'comments'
  // authorName: DS.attr('string'), // TAG:MOVED
  // contactEmail: DS.attr('string'), //TAG:MOVED
  // contactPhone: DS.attr('string'), //TAG:MOVED
  // content: DS.attr('string'), //TAG:MOVED
  // imageUrl: DS.attr('string'), //TAG:MOVED
  // listservIds: DS.attr('raw', {defaultValue: function(){ return []; }}), //TAG:MOVED
  // publishedAt: DS.attr('moment-date', {defaultValue: function(){ return moment(); }}), //TAG:MOVED
  // updatedAt: DS.attr('moment-date'), //TAG:MOVED
  // title: DS.attr('string'), //TAG:MOVED
  // organization: DS.belongsTo('organization'), //TAG:MOVED
  // sold: DS.attr('boolean', {defaultValue: false}), //TAG:MOVED
  // price: DS.attr('string'), //TAG:MOVED TAG:DISCUSS see note in content model mixin
  // hasContactInfo: DS.attr('boolean'), //TAG:MOVED
  // address: DS.attr('string'), //TAG:DELETED
  // city: DS.attr('string'), //TAG:DELETED
  // state: DS.attr('string'), //TAG:DELETED
  // zip: DS.attr('string'), //TAG:DELETED
  // ugcJob: DS.attr('string'), //TAG:MOVED
  // fullAddress: computed property, //TAG:DELETED
  // directionsLink: computed property, //TAG:DELETED
  // formattedPublishedAt: computed property //TAG:DELETED

  contentId: computed.oneWay('id'), //TAG:DISCUSSED this is used inconsistently
  images: DS.hasMany('image', { async: false }), //TAG:DISCUSS normalize image handling across content types

  listsEnabled: computed.notEmpty('listservIds'),

  // Populated images filter is here because there are times when
  // the image-upload component can set a null value to imageUrl
  populatedImages: computed('images.@each.imageUrl', function() {
    return get(this, 'images')
      .filter((image) => isPresent(get(image, 'imageUrl')));
  }),

  primaryImage: computed('images.[]', 'images.@each.primary', function() {
    return get(this, 'images').findBy('primary') || get(this, 'images').get('firstObject');
  }),

  featuredImageUrl: computed.oneWay('primaryImage.imageUrl'),
  featuredImageWidth: computed.oneWay('primaryImage.width'),
  featuredImageHeight: computed.oneWay('primaryImage.height'),

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
