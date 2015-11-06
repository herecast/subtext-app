import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import ajax from 'ic-ajax';
import config from '../config/environment';

const {
  computed,
  get,
  isPresent
} = Ember;

export default DS.Model.extend({
  authorName: DS.attr('string'),
  authorEmail: DS.attr('string'),
  canEdit: DS.attr('boolean'),
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  contentId: Ember.computed.oneWay('id'),
  extendedReachEnabled: DS.attr('boolean', {defaultValue: false}),
  hasContactInfo: DS.attr('boolean'),
  images: DS.hasMany('image'),
  imageUrl: DS.attr('string'),
  listservIds: DS.attr('raw', {defaultValue: []}),
  price: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  title: DS.attr('string'),

  populatedImages: computed('images.@each.imageUrl', function() {
    return get(this, 'images')
      .filter((image) => isPresent(get(image, 'imageUrl')));
  }),

  coverImageUrl: function() {
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
  }.property('images.@each.{primary,imageUrl}', 'imageUrl'),

  listsEnabled: Ember.computed.notEmpty('listservIds'),

  formattedPublishedAt: function() {
    return this.get('publishedAt').format('dddd, MMMM D, YYYY');
  }.property('publishedAt'),

  loadContactInfo() {
    const id = this.get('id');
    const url = `${config.API_NAMESPACE}/market_posts/${id}/contact`;

    return ajax(url).then((response) => {
      this.setProperties({
        contactEmail: response.market_post.contact_email,
        contactPhone: response.market_post.contact_phone,
      });
    });
  }
});
