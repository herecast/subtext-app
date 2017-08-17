import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import dateFormat from 'subtext-ui/lib/dates';
import BaseEvent from 'subtext-ui/mixins/models/base-event';

const { get, computed, isPresent, isEmpty } = Ember;

function isDefaultOrganization(organizationId) {
  return parseInt(organizationId) === 398;
}

export default DS.Model.extend(BaseEvent, {
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  content: DS.attr('string'),
  splitContent: DS.attr(),
  contentType: DS.attr('string'),
  contentOrigin: DS.attr('string'),
  canEdit: DS.attr('boolean', {defaultValue: false}),

  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  avatarUrl: DS.attr('string'),

  commentCount: DS.attr('number'),
  viewCount: DS.attr('number'),

  eventId: DS.attr('number'),
  eventInstances: DS.hasMany('other-event-instance', {async: false}),
  eventInstanceId: DS.attr('number'),
  venueAddress: DS.attr('string'),
  venueCity: DS.attr('string'),
  venueName: DS.attr('string'),
  venueState: DS.attr('string'),
  venueZip: DS.attr('string'),
  startsAt: DS.attr('moment-date'),
  endsAt: DS.attr('moment-date'),

  baseLocationNames: DS.attr('raw', {defaultValue: function(){ return []; }}),

  publishedAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),

  organization: DS.belongsTo('organization', {async: true}),
  organizationId: DS.attr('number'),
  organizationName: DS.attr('string'),
  organizationProfileImageUrl: DS.attr('string'),
  organizationBizFeedActive: DS.attr('boolean', {defaultValue: false}),

  imageUrl: DS.attr('string'),
  images: DS.hasMany('image', { async: false }),

  cost: DS.attr('string'),
  price: computed.alias('cost'),
  sold: DS.attr('boolean', {defaultValue: false}),

  normalizedContentType: computed('contentType', 'isListserv', function() {
  const isListserv = get(this, 'isListserv');
   let contentType = get(this, 'contentType');

   if (contentType === 'talk_of_the_town' || isListserv) {
     contentType = 'talk';
   }

   return contentType;
  }),

  contentId: computed.alias('id'),

  bannerImage: computed.alias('primaryImage'),
  coverImageUrl: computed.alias('bannerImage.url'),
  featuredImageWidth: computed.oneWay('bannerImage.width'),
  featuredImageHeight: computed.oneWay('bannerImage.height'),
  featuredImageUrl: computed.oneWay('bannerImage.url'),
  featuredImageCaption: computed.oneWay('bannerImage.caption'),

  primaryImageUrl: computed.oneWay('primaryImage.url'),
  primaryImageCaption: computed.oneWay('primaryImage.caption'),
  primaryImage: computed('images', function() {
    const primaryImage = get(this, 'images').find(image => {
      return get(image, 'primary') === true;
    });

    return isPresent(primaryImage) ? primaryImage : {url: get(this, 'imageUrl'), caption: null};
  }),

  isNews: computed.equal('normalizedContentType', 'news'),
  isMarket: computed.equal('normalizedContentType', 'market'),
  isEvent: computed.equal('normalizedContentType', 'event'),
  isTalk: computed.equal('normalizedContentType', 'talk'),
  isListserv: computed.equal('contentOrigin', 'listserv'),

  isOwnedByOrganization: computed('isListserv', 'isNews', 'organizationId', function() {
    const isListserv = get(this, 'isListserv');
    const isNews = get(this, 'isNews');
    const organizationId = get(this, 'organizationId');
    const organiztionIsDefaultOrganization = isDefaultOrganization(organizationId);

    if (isNews) {
      return true;
    } else if (organiztionIsDefaultOrganization || isListserv) {
      return false;
    } else {
      return isPresent(organizationId);
    }
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

  publishedAtRelative: computed('publishedAt', function() {
    return dateFormat.relative(get(this, 'publishedAt'));
  }),

  startsAtFormatted: computed('startsAt', function() {
    const startsAt = get(this, 'startsAt');

    return isPresent(startsAt) ? moment(startsAt).format('MMMM DD') : false;
  }),

  commentCountText: computed('commentCount', function() {
    const count = get(this, 'commentCount');

    if (count === 1) {
      return 'comment';
    } else {
      return 'comments';
    }
  }),

  viewCountText:computed('viewCount',  function() {
    const count = get(this, 'viewCount');

    if (count === 1) {
      return 'view';
    } else {
      return 'views';
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
    if (this.get('isValid')) {
      const startTime = get(this, 'startsAt').format('h:mmA');
      const endsAt = get(this, 'endsAt');

      if (isEmpty(endsAt)) {
        return startTime;
      } else {
        const endTime = endsAt.format('h:mmA');

        return `${startTime}-${endTime}`;
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
  })
});
