import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';
import ContentLocationsMixin from 'subtext-ui/mixins/models/content-locations';

const {
  computed,
  get,
  inject,
  isPresent,
  RSVP
} = Ember;

export default DS.Model.extend(FastbootExtensions, ContentLocationsMixin, {
  api: inject.service('api'),
  authorName: DS.attr('string'),
  authorEmail: DS.attr('string'),
  canEdit: DS.attr('boolean', {defaultValue: false}),
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  contentId: Ember.computed.oneWay('id'),
  hasContactInfo: DS.attr('boolean'),
  images: DS.hasMany('image', { async: false }),
  imageUrl: DS.attr('string'),
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  listservIds: DS.attr('raw', {defaultValue: function(){ return []; }}),
  price: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: function(){ return moment(); }}),
  updatedAt: DS.attr('moment-date'),
  sold: DS.attr('boolean', {defaultValue: false}),
  title: DS.attr('string'),
  organization: DS.belongsTo('organization'),

  // TODO: does the API provide market-post address data?
  address: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  ugcJob: DS.attr('string'),

  fullAddress: computed('address', 'city', 'state', 'zip', function() {
    const address = this.get('address');
    const city = this.get('city');
    const state = this.get('state');

    return `${address}, ${city}, ${state}`;
  }),

  directionsLink: computed('fullAddress', function() {
    const addressLink = get(this,'fullAddress') + "," + get(this,'zip');
    return 'http://maps.google.com/?q=' + encodeURIComponent( addressLink );
  }),

  populatedImages: computed('images.@each.imageUrl', function() {
    return get(this, 'images')
      .filter((image) => isPresent(get(image, 'imageUrl')));
  }),

  saveWithImages() {
    this.save();
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

      return RSVP.all(allImages);
    });
  },

  primaryImage: computed('images.[]', 'images.@each.primary', function() {
    return get(this, 'images').findBy('primary') || get(this, 'images').get('firstObject');
  }),

  featuredImageUrl: computed.oneWay('primaryImage.imageUrl'),
  featuredImageWidth: computed.oneWay('primaryImage.width'),
  featuredImageHeight: computed.oneWay('primaryImage.height'),

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

  rollbackImages() {
    get(this, 'images').forEach(image => image.rollbackAttributes());
  }
});
