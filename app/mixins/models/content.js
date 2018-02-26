import DS from 'ember-data';
import moment from 'moment';
import Ember from 'ember';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import dateFormat from 'subtext-ui/lib/dates';

/* This mixin contains common properties for the following models:
 * - feed-content
 * - event
 * - talk
 * - market-post
 * - event-instance
 *   NOT YET INCLUDED:
 *   - news
 */

const { computed:{equal}, computed, get, isPresent, isEmpty } = Ember;
const { attr } = DS;


export default Ember.Mixin.create({
  authorId: attr('number'),

  authorName: attr('string'),

  avatarUrl: attr('string'),

  // comments: DS.hasMany(), //NOTE:MOVED back to original models
  commentCount: attr('number'),

  contactEmail: attr('string'),
  contactPhone: attr('string'),

  content: attr('string'),
  contentType: attr('string'),
  contentOrigin: attr('string'), //NOTE:Only relevant to feed-content and possibly event-instance. Double-check how contentOrigin is being used across the site

  cost: attr('string'),

  costType: attr('string'),

  embeddedAd: attr('boolean'),

  endsAt: attr('moment-date'),

  eventId: attr('number'),
  eventInstanceId: attr('number'),

  eventUrl: attr('string'),

  hasContactInfo: attr('boolean'),

  hasRegistrationInfo: computed.notEmpty('registrationDeadline'),

  primaryImageUrl: computed.alias('imageUrl'),
  imageUrl: attr('string'),
  imageWidth: attr('string'),
  imageHeight: attr('string'),

  isNews: equal('normalizedContentType', 'news'),
  isMarket: equal('normalizedContentType', 'market'),
  isEvent: equal('normalizedContentType', 'event'),
  isTalk: equal('normalizedContentType', 'talk'),
  isCampaign: equal('normalizedContentType', 'campaign'),
  isListserv: equal('contentOrigin', 'listserv'),

  listservIds: attr('raw', {defaultValue() { return []; }}),

  normalizedContentType: computed('contentType', 'isListserv', function() {
    const isListserv = get(this, 'isListserv');
    let contentType = get(this, 'contentType');

    if (contentType === 'talk_of_the_town') {
      contentType = 'talk';
    } else if (isListserv) {
      contentType = 'listserv';
    }

    return contentType;
  }),


  organization: DS.belongsTo('organization', {async: true}),
  organizationId: attr('number'),
  organizationName: attr('string'),
  organizationProfileImageUrl: attr('string'),
  organizationBizFeedActive: attr('boolean', {defaultValue: false}),

  parentContentId: attr('number'), //TAG:NOTE can be removed after dashboard is removed (was a talk model property)
  parentContentType: attr('string'), //TAG:NOTE can possibly be removed after dashboard is removed (was a talk model property)
  parentEventInstanceId: attr('number'), //TAG:NOTE can possibly be removed after dashboard is removed

  publishedAt: attr('moment-date', {defaultValue() { return moment(); }}),

  publishedAtRelative: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    return isPresent(publishedAt) ? dateFormat.relative(publishedAt) : null;
  }),

  registrationDeadline: attr('moment-date'),

  sold: attr('boolean', {defaultValue: false}),

  startsAt: attr('moment-date'),

  subtitle: attr('string'),

  title: attr('string'),

  updatedAt: attr('moment-date'),

  ugcJob: attr('string'),

  venueAddress: attr('string'),
  venueCity: attr('string'),
  viewCount: attr('number'),
  venueId: attr('number'),
  venueName: attr('string'),
  venueState: attr('string'),
  venueStatus: attr('string'),
  venueUrl: attr('string'),
  venueZip: attr('string'),

  wantsToAdvertise: attr('boolean'),

  attributionImageUrl: computed('isNews', 'organizationProfileImageUrl', 'avatarUrl', function() {
    const organizationProfileImageUrl = get(this, 'organizationProfileImageUrl');
    const avatarUrl = get(this, 'avatarUrl');

    let attributionImageUrl = null;

    if (get(this, 'isNews')) {
      attributionImageUrl = organizationProfileImageUrl;
    } else if (isPresent(organizationProfileImageUrl) && !isDefaultOrganization(get(this, 'organizationId')) && !get(this, 'isListserv')) {
      attributionImageUrl = organizationProfileImageUrl;
    } else if (isPresent(avatarUrl)) {
      attributionImageUrl = avatarUrl;
    }

    return attributionImageUrl;
  }),

  attributionName: computed('isNews', 'organizationName', 'authorName', function() {
    const organizationName = get(this, 'organizationName');
    const authorName = get(this, 'authorName');

    let attributionName = null;

    if (get(this, 'isNews')) {
      attributionName = organizationName;
    } else if (isPresent(organizationName) && !isDefaultOrganization(get(this, 'organizationId')) && !get(this, 'isListserv') ) {
      attributionName = organizationName;
    } else if (isPresent(authorName)) {
      attributionName = authorName;
    }

    return attributionName;
  }),

  formattedRegistrationDeadline: computed('registrationDeadline', function() { //TAG:NOTE can be deleted when dashboard is removed
    const deadline = get(this, 'registrationDeadline');

    if (deadline) {
      return moment(deadline).format('L');
    }
  }),

  isValid: computed('startsAt', 'endsAt', function() {
    const start = get(this, 'startsAt');
    const stop = get(this, 'endsAt');

    if (isPresent(start) && isPresent(stop)) {
      const earlierByHour = start.hour() < stop.hour();
      const earlierByMinute = start.hour() === stop.hour() && start.minute() <= stop.minute();

      return earlierByHour || earlierByMinute;
    } else {
      return isPresent(start);
    }
  }),

  timeRange: computed('startsAt', 'endsAt', function() {
    if (get(this, 'isValid')) {
      const startTime = get(this, 'startsAt').format('MMMM D, YYYY LT');

      if (isEmpty(get(this, 'endsAt'))) {
        return `${startTime}`;
      } else {
        const endTime = get(this, 'endsAt').format('LT');
        return `${startTime} - ${endTime}`;
      }
    }
  }),

  timeRangeNoDates: computed('startsAt', 'endsAt', function() {
    if (get(this, 'isValid')) {
      const startTime = get(this, 'startsAt').format('h:mm A');
      const endsAt = get(this, 'endsAt');

      if (isEmpty(endsAt)) {
        return startTime;
      } else {
        const endTime = endsAt.format('h:mm A');

        return `${startTime} ${String.fromCharCode(0x2014)} ${endTime}`;
      }
    }
  }),

  promoteRadius: attr('number'),
  location: DS.belongsTo('location'), // TODO move back into models
  baseLocations: DS.hasMany('location'), // TODO move back into models
});
