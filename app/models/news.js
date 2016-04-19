import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { computed, get } = Ember;

export default DS.Model.extend({
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  content: DS.attr('string'),

  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  commentCount: DS.attr('number'),
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  images: DS.attr('raw', {defaultValue: function(){ return [];}}),
  organization: DS.belongsTo('Organization', {async: true}),

  publishedAt: DS.attr('moment-date'),

  organizationId: computed.oneWay('organization.id'),
  organizationName: computed.oneWay('organization.name'),

  organization: DS.belongsTo('organization', {async: true}),

  formattedPublishedAt: computed('publishedAt', function() {
    return moment(this.get('publishedAt')).format('dddd, MMMM D, YYYY');
  }),

  bannerImage: computed('images', function() {
    return get(this, 'images').find((image) => {
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

    return moment(publishedAt).isBefore(now) || moment(publishedAt).isSame(now);
  }),

  hasUnpublishedChanges: computed('isSaving', 'isPublished', 'isScheduled', 'hasDirtyAttributes', 'didOrgChange', function() {
    const isScheduledOrPublished = (get(this, 'isPublished') || get(this, 'isScheduled'));

    return isScheduledOrPublished &&
      (get(this, 'hasDirtyAttributes') || get(this, 'didOrgChange')) &&
      (!get(this, 'isSaving'));
  }),

  // Used to notify hasUnpublishedChanges when a new organization is changed
  // Since Ember Data does not set hasDirtyAttributes to true when a child relationship changes
  didOrgChange: false
});
