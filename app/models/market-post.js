import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const {
  computed,
  get,
  inject,
  isPresent,
  RSVP
} = Ember;

export default DS.Model.extend({
  api: inject.service('api'),
  authorName: DS.attr('string'),
  authorEmail: DS.attr('string'),
  canEdit: DS.attr('boolean'),
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  contentId: Ember.computed.oneWay('id'),
  extendedReachEnabled: DS.attr('boolean', {defaultValue: true}),
  hasContactInfo: DS.attr('boolean'),
  images: DS.hasMany('image', { async: false }),
  imageUrl: DS.attr('string'),
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  listservIds: DS.attr('raw', {defaultValue: function(){ return []; }}),
  myTownOnly: DS.attr('boolean'),
  price: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: function(){ return moment(); }}),
  title: DS.attr('string'),
  organization: DS.belongsTo('organization'),

  populatedImages: computed('images.@each.imageUrl', function() {
    return get(this, 'images')
      .filter((image) => isPresent(get(image, 'imageUrl')));
  }),

  saveWithImages() {
    const imagesToSave = get(this, 'images').filterBy('imageUrl');
    const imagesToDelete = get(this, 'images').filterBy('_delete');

    return this.save().then((post) => {
      imagesToSave.setEach('contentId', get(post, 'id'));

      const savedImages = imagesToSave.map((image) => {
        return image.save();
      });

      const deletedImages = imagesToDelete.map((image) => {
        return image.destroyRecord();
      });

      const allImages = savedImages.concat(deletedImages);

      return RSVP.all(allImages);
    });
  },

  coverImageUrl: computed('images.@each.{primary,imageUrl}', 'imageUrl', function() {
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

  listsEnabled: Ember.computed.notEmpty('listservIds'),

  formattedPublishedAt: computed('publishedAt', function() {
    return this.get('publishedAt').format('dddd, MMMM D, YYYY');
  }),

  loadContactInfo() {
    const api = get(this, 'api');
    const id = get(this, 'id');

    return api.getMarketContactInfo(id).then((response) => {
      this.setProperties({
        contactEmail: response.market_post.contact_email,
        contactPhone: response.market_post.contact_phone,
      });
    });
  },

  rollbackImages() {
    get(this, 'images').forEach(image => image.rollbackAttributes());
  }
});
