import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import BaseEvent from 'subtext-ui/mixins/models/base-event';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import Content from 'subtext-ui/mixins/models/content';

const { get, computed, isPresent, isEmpty } = Ember;

export default DS.Model.extend(BaseEvent, Content, {
  // authorId: DS.attr('number'), //TAG:MOVED
  // authorName: DS.attr('string'), // TAG:MOVED
  // commentCount: DS.attr('number'), //TAG:MOVED
  // content: DS.attr('string'), //TAG:MOVED
  // contentOrigin: DS.attr('string'), //TAG:MOVED
  // contentType: DS.attr('string'), //TAG:MOVED
  // cost: DS.attr('string'), //TAG:MOVED
  // imageUrl: DS.attr('string'), //TAG:MOVED
  // isNews: computed.equal('normalizedContentType', 'news'), //TAG:MOVED
  // isMarket: computed.equal('normalizedContentType', 'market'), //TAG:MOVED
  // isEvent: computed.equal('normalizedContentType', 'event'), //TAG:MOVED
  // isTalk: computed.equal('normalizedContentType', 'talk'), //TAG:MOVED
  // isCampaign: computed.equal('normalizedContentType', 'campaign'),
  // isListserv: computed.equal('contentOrigin', 'listserv'), //TAG:MOVED
  // organization: DS.belongsTo('organization', {async: true}), //TAG:MOVED
  // organizationId: DS.attr('number'), //TAG:MOVED
  // organizationName: DS.attr('string'), //TAG:MOVED
  // organizationProfileImageUrl: DS.attr('string'), //TAG:MOVED
  // organizationBizFeedActive: DS.attr('boolean', {defaultValue: false}), //TAG:MOVED
  // price: computed.alias('cost'), //TAG:MOVED
  // publishedAt: DS.attr('moment-date'), //TAG:MOVED
  // sold: DS.attr('boolean', {defaultValue: false}), //TAG:MOVED
  // title: DS.attr('string'), //TAG:MOVED
  // updatedAt: DS.attr('moment-date'), //TAG:MOVED
  // comments: DS.hasMany(), //TAG:MOVED
  // contentLocations: DS.hasMany('content-location'), //TAG:DISCUSS why different from content-locations mixin
  // baseLocations: computed.filterBy('contentLocations', 'locationType', 'base'), //TAG:DISCUSS why different from content-locations mixin
  // baseLocationNames: computed.mapBy('baseLocations', 'locationName'), //TAG:DISCUSS why different from content-locations mixin
  // viewCount: DS.attr('number'), //TAG:MOVED
  // eventInstanceId: DS.attr('number'), //TAG:MOVED
  // subtitle: DS.attr('string'), //TAG:MOVED
  // eventId: DS.attr('number'), //TAG:MOVED
  // startsAt: DS.attr('moment-date'), //TAG:MOVED
  // endsAt: DS.attr('moment-date'), //TAG:MOVED
  // avatarUrl: DS.attr('string'), //TAG:MOVED
  // embeddedAd: DS.attr('boolean'), //TAG:MOVED

  ugcBaseLocation: null, //TAG:OVERRIDDEN from Content model mixin because 'feed-content' has no 'location' relationship
  eventInstances: DS.hasMany('other-event-instance', {async: false}),
  images: DS.hasMany('image', { async: false }),

  splitContent: DS.attr(),
  comments: DS.hasMany('comment'), //TAG:RESTORED


  /* BEGIN Leaving these here for now as they appear to be not applicable to the old channel models */
  sunsetDate: DS.attr('moment-date'),
  bizFeedPublic: DS.attr('string'),
  campaignEnd: DS.attr('moment-date'),
  campaignStart: DS.attr('moment-date'),
  clickCount: DS.attr('number'),
  redirectUrl: DS.attr('string'),
  /* END Leaving these here for now as they appear to be not applicable to the old channel models */








  contentId: computed.alias('id'), //TAG:NOTE contentId is treated inconsistently across models

  // TAG:NOTE image handling should be stanardized. Notes on this sent to JohnO ~cm
  bannerImage: computed.alias('primaryImage'),
  coverImageUrl: computed.alias('bannerImage.imageUrl'),
  featuredImageWidth: computed.oneWay('bannerImage.width'),
  featuredImageHeight: computed.oneWay('bannerImage.height'),
  featuredImageUrl: computed.oneWay('bannerImage.imageUrl'),
  featuredImageCaption: computed.oneWay('bannerImage.caption'),

  primaryImageUrl: computed.oneWay('primaryImage.imageUrl'),
  primaryImageCaption: computed.oneWay('primaryImage.caption'),
  primaryImage: computed('images.@each.{imageUrl,primary}', 'imageUrl', function() {
    const primaryImage = get(this, 'images').find(image => {
      return get(image, 'primary') === 1;
    });

    return isPresent(primaryImage) ? primaryImage : {imageUrl: get(this, 'imageUrl'), caption: null};
  }),

  // TAG:NOTE: Do this server-side. Have the server figure out what attribution should be displayed
  isOwnedByOrganization: computed('isListserv', 'isNews', 'organizationId', function() { //TAG:DISCUSS
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

  attributionLinkRouteName: computed('isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'isOwnedByOrganization') && isPresent(get(this, 'organizationId'))) {
      routeName = 'profile';
    }

    return routeName;
  }),

  attributionLinkId: computed.alias('organizationId'),

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

  futureInstances: computed('eventInstances.@each.startsAt', function() {
    const currentDate = new Date();

    return get(this, 'eventInstances').filter((inst) => {
      return get(inst, 'startsAt') > currentDate;
    });
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

  /* BEGIN Biz/org/content-management properties */
  campaignIsActive: computed('campaignStart', 'campaignEnd', function() {
    const campaignStart = moment(get(this, 'campaignStart'));
    const campaignEnd = moment(get(this, 'campaignEnd'));

    return moment().isAfter(campaignStart) && moment().isBefore(campaignEnd);
  }),

  //TAG:NOTE should this be a mixin that is pulled into components that care about viewStatus (e.g., profile controller, promotion-menu, bizfeed etc)
  viewStatus: computed('publishedAt', 'bizFeedPublic', 'campaignIsActive', function() {
    const publishedAt = get(this, 'publishedAt');
    const scheduledToPublish = moment().diff(publishedAt) < 0;

    if (!isPresent(publishedAt) || scheduledToPublish) {
      return 'draft';
    }

    const contentType = get(this, 'contentType');
    let publicProperty = get(this, 'bizFeedPublic');

    if (contentType === 'campaign' && !isPresent(publicProperty)) {
      publicProperty = get(this, 'campaignIsActive');
    }

    const isPublic = isPresent(publicProperty) ? publicProperty : true;

    return (isPublic === "true" || isPublic === true) ? 'public' : 'private';
  }),

  isPublic: computed.equal('viewStatus', 'public'),
  isDraft: computed.equal('viewStatus', 'draft')
  /* END Biz/org/content-management properties */
});
