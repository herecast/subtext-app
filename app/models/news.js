import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { computed, get } = Ember;

export default DS.Model.extend({
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  content: DS.attr('string'),
  splitContent: DS.attr(),
  canEdit: DS.attr('boolean', {defaultValue: false}),

  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  commentCount: DS.attr('number'),
  contentId: computed.alias('id'),
  imageUrl: DS.attr('string'),

  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  images: DS.attr('raw', {defaultValue: function(){ return [];}}),

  featuredImageWidth: computed.oneWay('bannerImage.width'),
  featuredImageHeight: computed.oneWay('bannerImage.height'),
  featuredImageUrl: computed.oneWay('bannerImage.url'),
  featuredImageCaption: computed.oneWay('bannerImage.caption'),

  organization: DS.belongsTo('Organization', {async: true}),

  publishedAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),

  organizationId: DS.attr('number'),
  organizationName: DS.attr('string'),

  formattedPublishedAt: computed('publishedAt', function() {
    return moment(this.get('publishedAt')).format('dddd, MMMM D, YYYY');
  }),

  bannerImage: computed('images', function() {
    return get(this, 'images').find(image => {
      return get(image, 'primary') === true;
    });
  }),

  isDraft: computed('publishedAt', function() {
    return (!get(this, 'publishedAt'));
  }),

  isScheduled: computed('publishedAt', function() {
    return moment(get(this, 'publishedAt')).isAfter(new Date());
  }),

  isPublished: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    const now = new Date();

    if (publishedAt) {
      return moment(publishedAt).isBefore(now) || moment(publishedAt).isSame(now);
    }
      return null;
  }),

  hasUnpublishedChanges: computed('isSaving', 'isPublished', 'isScheduled', 'hasDirtyAttributes', 'didOrgChange', 'dirtyType', function() {
    const isScheduledOrPublished = (get(this, 'isPublished') || get(this, 'isScheduled'));
    const isNew = (get(this, 'dirtyType') === 'created');

    return isScheduledOrPublished &&
      ((get(this, 'hasDirtyAttributes') && !isNew) || get(this, 'didOrgChange')) &&
      (!get(this, 'isSaving'));
  }),

  // Used to notify hasUnpublishedChanges when a new organization is changed
  // Since Ember Data does not set hasDirtyAttributes to true when a child relationship changes
  didOrgChange: false
});
