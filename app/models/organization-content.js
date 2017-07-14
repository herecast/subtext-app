import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const {get, isPresent, computed} = Ember;

export default DS.Model.extend({
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  avatarUrl: DS.attr('string'),
  bizFeedPublic: DS.attr('string'),
  businessProfile: DS.belongsTo('business-profile'),
  campaignEnd: DS.attr('moment-date'),
  campaignStart: DS.attr('moment-date'),
  clickCount: DS.attr('number'),
  commentCount: DS.attr('number'),
  commenterCount: DS.attr('number'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  contentType: DS.attr('string'),
  cost: DS.attr('string'),
  createdAt: DS.attr('moment-date'),
  endsAt: DS.attr('moment-date'),
  eventId: DS.attr('number'),
  eventInstanceId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  organizationId: DS.attr('number'),
  organizationName: DS.attr('string'),
  organizationProfileImageUrl: DS.attr('string'),
  parentContentId: DS.attr('number'),
  parentContentType: DS.attr('string'),
  parentEventInstanceId: DS.attr('number'),
  publishedAt: DS.attr('moment-date'),
  redirectUrl: DS.attr('string'),
  registrationDeadline: DS.attr(''),
  startsAt: DS.attr('moment-date'),
  sunsetDate: DS.attr('moment-date'),
  title: DS.attr('string'),
  updatedAt: DS.attr('string'),
  venueAddress: DS.attr('string'),
  venueName: DS.attr('string'),
  viewCount: DS.attr('number'),

  campaignIsActive: computed('campaignStart', 'campaignEnd', function() {
    const campaignStart = moment(get(this, 'campaignStart'));
    const campaignEnd = moment(get(this, 'campaignEnd'));

    return moment().isAfter(campaignStart) && moment().isBefore(campaignEnd);
  }),

  viewStatus: computed('publishedAt', 'bizFeedPublic', 'campaignIsActive', function() {
    const publishedAt = get(this, 'publishedAt');

    if (!isPresent(publishedAt)) {
      return 'draft';
    }

    const contentType = get(this, 'contentType');
    let publicProperty = get(this, 'bizFeedPublic');

    if (contentType === 'campaign' && !isPresent(publicProperty)) {
      publicProperty = get(this, 'campaignIsActive');
    }

    const isPublic = isPresent(publicProperty) ? publicProperty : true;

    return (isPublic === "true" || isPublic === true) ? 'public' : 'private';
  })
});
