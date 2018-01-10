import DS from 'ember-data';
import Ember from 'ember';
import BaseEvent from '../mixins/models/base-event';
import moment from 'moment';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import dateFormat from 'subtext-ui/lib/dates';

const {
  computed,
  get,
  isPresent,
  isEmpty
} = Ember;

export default DS.Model.extend(BaseEvent, {
  normalizedContentType: 'event',
  // Only returned by the API if the current user is an admin
  adminContentUrl: DS.attr('string'),
  commentCount: DS.attr('number'),
  contentId: DS.attr('number'),
  eventId: DS.attr('number'),
  eventInstances: DS.hasMany('other-event-instance'),
  presenterName: DS.attr('string'),
  venueLatitude: DS.attr('string'),
  venueLongitude: DS.attr('string'),
  venueLocateName: DS.attr('string'),
  publishedAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),
  organization: DS.belongsTo('organization'),
  organizationName: DS.attr('string'),
  organizationId: DS.attr('number'),
  organizationProfileImageUrl: DS.attr('string'),

  eventInstanceId: computed.alias('id'),
  isListserv: computed.equal('contentOrigin', 'listserv'),

  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  avatarUrl: DS.attr('string'),

  formattedDate: computed('isValid', 'startsAt', 'endsAt', function() {
    if (this.get('isValid')) {
      const date = this.get('startsAt').format('MMM D');
      const startTime = this.get('startsAt').format('h:mmA');

      if (Ember.isEmpty(this.get('endsAt'))) {
        return `${date} | ${startTime}`;
      } else {
        const endTime = this.get('endsAt').format('h:mmA');

        return `${date} | ${startTime}-${endTime}`;
      }
    }
  }),

  startsAtHour: Ember.computed('startsAt', function() {
    if(get(this, 'isValid')) {
      return get(this, 'startsAt').format('h:mmA');
    }
  }),

  startsAtUnix: Ember.computed('startsAt', function() {
    return moment(get(this, 'startsAt')).unix();
  }),

  startsAtFormatted: computed('startsAt', function() {
    const startsAt = get(this, 'startsAt');

    return isPresent(startsAt) ? moment(startsAt).format('MMMM DD') : false;
  }),

  endsAtHour: Ember.computed('endsAt', function() {
    if(get(this, 'isValid')) {
       const endsAt = get(this, 'endsAt');

       return (endsAt) ? `${endsAt.format('h:mmA')}` : null;
     }
  }),

  timeRange: computed('startsAt', 'endsAt', function() {
    if (this.get('isValid')) {
      const startTime = this.get('startsAt').format('MMMM D, YYYY LT');

      if (Ember.isEmpty(this.get('endsAt'))) {
        return `${startTime}`;
      } else {
        const endTime = this.get('endsAt').format('LT');
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

  attributionName: computed('organizationName', 'authorName', function() {
    const organizationName = get(this, 'organizationName');
    const authorName = get(this, 'authorName');

    let attributionName = null;

    if (isPresent(organizationName) && !isDefaultOrganization(get(this, 'organizationId')) && !get(this, 'isListserv') ) {
      attributionName = organizationName;
    } else if (isPresent(authorName)) {
      attributionName = authorName;
    }

    return attributionName;
  }),

  attributionImageUrl: computed('isNews', 'organizationProfileImageUrl', 'avatarUrl', function() {
    const organizationProfileImageUrl = get(this, 'organizationProfileImageUrl');
    const avatarUrl = get(this, 'avatarUrl');

    let attributionImageUrl = null;

    if (isPresent(organizationProfileImageUrl) && !isDefaultOrganization(get(this, 'organizationId')) && !get(this, 'isListserv')) {
      attributionImageUrl = organizationProfileImageUrl;
    } else if (isPresent(avatarUrl)) {
      attributionImageUrl = avatarUrl;
    }

    return attributionImageUrl;
  }),

  isOwnedByOrganization: computed('isListserv', 'organizationId', function() {
    const isListserv = get(this, 'isListserv');
    const organizationId = get(this, 'organizationId');
    const organiztionIsDefaultOrganization = isDefaultOrganization(organizationId);

    if (organiztionIsDefaultOrganization || isListserv) {
      return false;
    } else {
      return isPresent(organizationId);
    }
  }),

  futureInstances: computed('eventInstances.@each.startsAt', function() {
    const currentDate = new Date();

    return get(this, 'eventInstances').filter((inst) => {
      return get(inst, 'startsAt') > currentDate;
    });
  }),

  publishedAtRelative: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    return isPresent(publishedAt) ? dateFormat.relative(publishedAt) : null;
  })
});
