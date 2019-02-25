import { alias, empty } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import dateFormat from 'subtext-ui/lib/dates';
import HasImages from 'subtext-ui/mixins/models/has-images';
import HasVenue from 'subtext-ui/mixins/models/has-venue';

const { attr, belongsTo, hasMany, Model } = DS;

/**
 * NOTE: this is a read-only model
 */

export default Model.extend(HasImages, HasVenue, {
  authorId: attr('number'),
  authorName: attr('string'),
  avatarUrl: attr('string'),
  bizFeedPublic: attr('string'),
  clickCount: attr('number'),
  commentCount: attr('number'),
  comments: hasMany(),
  contactEmail: attr('string'),
  contactPhone: attr('string'),
  content: attr('string'),
  contentId: attr('number'),
  contentOrigin: attr('string'),
  contentType: 'event',
  cost: attr('string'),
  embeddedAd: attr('boolean', {defaultValue: true}),
  endsAt: attr('moment-date'),
  eventId: attr('number'),
  eventInstanceId: alias('id'),
  otherEventInstances: hasMany('other-event-instance'),
  isEvent: true,
  organization: belongsTo('organization'),
  organizationBizFeedActive: attr('boolean', {defaultValue: false}),
  organizationId: attr('number'),
  organizationName: attr('string'),
  organizationProfileImageUrl: attr('string'),
  publishedAt: attr('moment-date', {defaultValue: () => { return moment(); }}),
  shortLink: attr('string'),
  splitContent: attr(),
  startsAt: attr('moment-date'),
  subtitle: attr('string'),
  title: attr('string'),
  updatedAt: attr('moment-date'),
  url: attr('string'),
  viewCount: attr('number'),

  eventInstances: alias('otherEventInstances'),

  isHiddenFromFeed: attr('boolean', {defaultValue: false}),

  publishedAtRelative: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    return isPresent(publishedAt) ? dateFormat.relative(publishedAt) : null;
  }),

  futureInstances: computed('eventInstances.@each.{startsAt,endsAt}', function() {
    const currentDate = new Date();

    let futureInstances = get(this, 'eventInstances').filter((inst) => {
      let timeToCompare = get(inst, 'endsAt') ? get(inst, 'endsAt') : get(inst, 'startsAt');

      return timeToCompare > currentDate;
    });

    return futureInstances.sort((a,b) => {
      return get(a, 'startsAt') - get(b, 'startsAt');
    });
  }),

  hasExpired: empty('futureInstances'),

  formattedDate: computed('isValid', 'startsAt', 'endsAt', function() {
    if (get(this, 'isValid')) {
      const date = get(this, 'startsAt').format('MMM D');
      const startTime = get(this, 'startsAt').format('h:mmA');

      if (isEmpty(get(this, 'endsAt'))) {
        return `${date} | ${startTime}`;
      } else {
        const endTime = get(this, 'endsAt').format('h:mmA');

        return `${date} | ${startTime}-${endTime}`;
      }
    }
  }),

  baseLocationName: computed('venueCity', 'venueState', function() {
    const city = get(this, 'venueCity');
    const state = get(this, 'venueState');

    if (isPresent(city) && isPresent(state)) {
      return `${city}, ${state}`;
    } else {
      return null;
    }
  }),

  startsAtHour: computed('startsAt', function() {
    if(get(this, 'isValid')) {
      return get(this, 'startsAt').format('h:mmA');
    }
  }),

  startsAtUnix: computed('startsAt', function() {
    return moment(get(this, 'startsAt')).unix();
  }),

  startsAtFormatted: computed('startsAt', function() {
    const startsAt = get(this, 'startsAt');

    return isPresent(startsAt) ? moment(startsAt).format('MMMM DD') : false;
  }),

  endsAtHour: computed('endsAt', function() {
    if(get(this, 'isValid')) {
       const endsAt = get(this, 'endsAt');

       return (endsAt) ? `${endsAt.format('h:mmA')}` : null;
     }
  }),

  isOwnedByOrganization: computed('organizationId', function() { //TAG:DISCUSS
    const organizationId = get(this, 'organizationId');
    const organiztionIsDefaultOrganization = isDefaultOrganization(organizationId);

    if (organiztionIsDefaultOrganization) {
      return false;
    } else {
      return isPresent(organizationId);
    }
  }),

  attributionImageUrl: computed('isNews', 'organizationProfileImageUrl', 'avatarUrl', function() {
    const organizationProfileImageUrl = get(this, 'organizationProfileImageUrl');
    const avatarUrl = get(this, 'avatarUrl');

    let attributionImageUrl = null;

    if (get(this, 'isNews')) {
      attributionImageUrl = organizationProfileImageUrl;
    } else if ( isPresent(get(this, 'organizationId')) && !isDefaultOrganization(get(this, 'organizationId')) ) {
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
    } else if (isPresent(get(this, 'organizationId')) && !isDefaultOrganization(get(this, 'organizationId')) ) {
      attributionName = organizationName;
    } else if (isPresent(authorName)) {
      attributionName = authorName;
    }

    return attributionName;
  }),

  attributionLinkRouteName: computed('isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'isOwnedByOrganization') && isPresent(get(this, 'organizationId'))) {
      routeName = 'profile';
    }

    return routeName;
  }),

  attributionLinkId: alias('organizationId'),

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
});
