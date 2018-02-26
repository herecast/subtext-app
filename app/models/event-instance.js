import DS from 'ember-data';
import Ember from 'ember';
import BaseEvent from 'subtext-ui/mixins/models/base-event';
import moment from 'moment';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import dateFormat from 'subtext-ui/lib/dates';
import Content from 'subtext-ui/mixins/models/content';

const {
  computed,
  get,
  isPresent,
  isEmpty
} = Ember;

export default DS.Model.extend(BaseEvent, Content, {
  normalizedContentType: 'event',
  comments: DS.hasMany(), //TAG:NOTE:no longer provided by BaseEvent mixin
  contentId: DS.attr('number'), //TAG:NOTE override in other serializers where it is an alias of ID
  eventInstances: DS.hasMany('other-event-instance'), //N
  organization: DS.belongsTo('organization'), //NOTE:DISCUSS is async true in mixins/models/content

  // venueLatitude: DS.attr('string'), //TAG:DELETED
  // venueLongitude: DS.attr('string'), //TAG:DELETED
  // venueLocateName: DS.attr('string'), //TAG:DELETED
  // adminContentUrl: DS.attr('string'), //TAG:DELETED
  // title: DS.attr('string'), //TAG:MOVED
  // content: DS.attr('string'), //TAG:MOVED
  // costType: DS.attr('string'), //TAG:MOVED
  // imageUrl: DS.attr('string'), //TAG:MOVED
  // imageWidth: DS.attr('string'), //TAG:MOVED
  // imageHeight: DS.attr('string'), //TAG:MOVED
  // contactEmail: DS.attr('string'), //TAG:MOVED
  // contactPhone: DS.attr('string'), //TAG:MOVED
  // cost: DS.attr('string'), //TAG:MOVED
  // startsAt: DS.attr('moment-date'), //TAG:MOVED
  // endsAt: DS.attr('moment-date'), //TAG:MOVED
  // venueAddress: DS.attr('string'), //TAG:MOVED
  // venueCity: DS.attr('string'), //TAG:MOVED
  // venueName: DS.attr('string'), //TAG:MOVED
  // venueState: DS.attr('string'), //TAG:MOVED
  // venueZip: DS.attr('string'), //TAG:MOVED
  // commentCount: DS.attr('number'), //TAG:MOVED
  // eventId: DS.attr('number'), //TAG:MOVED
  // publishedAt: DS.attr('moment-date'), //TAG:MOVED //TAG:DISCUSS if this creates a default value, it will mess with the news editor
  // updatedAt: DS.attr('moment-date'), //TAG:MOVED
  // organizationName: DS.attr('string'), //TAG:MOVED
  // organizationId: DS.attr('number'), //TAG:MOVED
  // organizationProfileImageUrl: DS.attr('string'), //TAG:MOVED
  // organizationBizFeedActive: DS.attr('boolean', {defaultValue: false}), //TAG:MOVED
  // isListserv: computed.equal('contentOrigin', 'listserv'), //TAG:MOVED
  // authorId: DS.attr('number'), //TAG:MOVED
  // authorName: DS.attr('string'), //TAG:MOVED
  // avatarUrl: DS.attr('string'), //TAG:MOVED

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

  isOwnedByOrganization: computed('isListserv', 'organizationId', function() { //TAG:DISCUSS
    const isListserv = get(this, 'isListserv');
    const organizationId = get(this, 'organizationId');
    const organiztionIsDefaultOrganization = isDefaultOrganization(organizationId);

    if (organiztionIsDefaultOrganization || isListserv) {
      return false;
    } else {
      return isPresent(organizationId);
    }
  }),

  publishedAtRelative: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    return isPresent(publishedAt) ? dateFormat.relative(publishedAt) : null;
  })
});
