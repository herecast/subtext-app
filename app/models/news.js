import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import ContentLocationsMixin from 'subtext-ui/mixins/models/content-locations';

const { computed, get } = Ember;

/* Properties in this model tagged with 'TAG:COMMON'
 * are marked because they are common to all of our main
 * content models (event, talk, market-post) but unlike those
 * other models, they are not provided via a mixin at this time
 */

export default DS.Model.extend(ContentLocationsMixin, {
  // NOTE:this model does not have 'comments' //TAG:DISCUSS
  title: DS.attr('string'), //TAG:COMMON
  subtitle: DS.attr('string'),
  content: DS.attr('string'), //TAG:COMMON
  splitContent: DS.attr(),

  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'), //TAG:COMMON
  authorName: DS.attr('string'), //TAG:COMMON
  commentCount: DS.attr('number'), //TAG:COMMON
  contentId: computed.alias('id'),
  imageUrl: DS.attr('string'), //TAG:COMMON

  // NOTE:this model does not have 'listservIds'
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  images: DS.attr('raw', {defaultValue: function(){ return [];}}),

  featuredImageWidth: computed.oneWay('bannerImage.width'),
  featuredImageHeight: computed.oneWay('bannerImage.height'),
  featuredImageUrl: computed.oneWay('bannerImage.url'),
  featuredImageCaption: computed.oneWay('bannerImage.caption'),

  organization: DS.belongsTo('Organization', {async: true}), //TAG:COMMON
  organizationId: DS.attr('number'), //TAG:COMMON
  organizationName: DS.attr('string'), //TAG:COMMON

  publishedAt: DS.attr('moment-date'), //TAG:COMMON
  updatedAt: DS.attr('moment-date'), //TAG:COMMON

  promoteRadius: DS.attr('number'),

  contentType: 'news', //TAG:NOTE: the api should provide this TAG:COMMON

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
