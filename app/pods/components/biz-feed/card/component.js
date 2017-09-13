import Ember from 'ember';
import moment from 'moment';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';
import dateFormat from 'subtext-ui/lib/dates';

const {get, computed, isPresent, String:{htmlSafe}, inject:{service}} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-biz-feed-card'],
  'data-test-biz-feed-card': computed.alias('content.viewStatus'),
  classNames: ['BizFeed-Card'],
  classNameBindings: ['contentType', 'content.viewStatus'],

  content: null,
  business: null,
  organization: null,
  activeTab: null,
  isOrganizationManager: false,

  defaultOrganizationId: 398,  //398 is dailyuv default organization

  store: service(),

  contentType: computed('content.contentType', function() {
    const contentType = get(this, 'content.contentType');

    if (contentType === 'sponsored_content') {
      return 'news';
    }

    return contentType;
  }),

  contentId: computed('content.id', 'contentType', function() {
    const contentType = get(this, 'contentType');
    return contentType === 'event' ? get(this, 'content.eventInstanceId') : get(this, 'content.id');
  }),

  isBannerAd: computed.equal('content.contentType', 'campaign'),

  showTitle: computed('isBannerAd', 'isOrganizationManager', function() {
    const isOrganizationManager = get(this, 'isOrganizationManager');
    const isBannerAd = get(this, 'isBannerAd');

    if (isBannerAd) {
      return isOrganizationManager;
    }

    return true;
  }),

  organizationLocation: computed('business.{city,state}', function() {
    return `${get(this, 'business.city')}, ${get(this, 'business.state')}`;
  }),

  imageStyle: computed('content.imageUrl', function() {
    const imageUrl = get(this, 'content.imageUrl');
    const options = get(this, 'isBannerAd') ? [imageUrl,772,640,true] : [imageUrl,772,640,true];

    if (isPresent(imageUrl)) {
        return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  }),

  startDay: computed('content.startsAt', function() {
    return moment(get(this, 'content.startsAt')).format('DD');
  }),

  startMonth: computed('content.startsAt', function() {
    return moment(get(this, 'content.startsAt')).format('MMMM');
  }),

  startTime: computed('content.startsAt', function() {
    return moment(get(this, 'content.startsAt')).format('h:mm A');
  }),

  hasVenue: computed.notEmpty('venue'),
  venueName: computed.oneWay('content.venueName'),
  venueCity: computed.oneWay('content.venueCity'),
  venueState: computed.oneWay('content.venueState'),

  venue: computed('venueName', 'venueCity', 'venueState', function() {
    const name  = get(this, 'venueName'),
          city  = get(this, 'venueCity'),
          state = get(this, 'venueState');

    if (isPresent(name)) {
      return name;
    } else {
      return [city, state].join(', ');
    }
  }),

  contentOwnedByDefaultOrganization: computed('content.organizationId', function() {
    return parseInt(get(this, 'content.organizationId')) === parseInt(get(this, 'defaultOrganizationId'));
  }),

  currentOrganizationOwnsContent: computed('content.organizationId', 'organization.id', function() {
    return parseInt(get(this, 'content.organizationId')) === parseInt(get(this, 'organization.id'));
  }),

  _orgIsListserv(orgName) {
    return isPresent(orgName) ? orgName.toLowerCase().indexOf('listserv') >= 0 : false;
  },

  contentAuthor: computed('organization.{name,id}', 'content.{authorName,organizationId}', function() {
    const currentOrganizationOwnsContent = get(this, 'currentOrganizationOwnsContent');
    const authorString = get(this, 'content.authorName') || '';
    const authorName = authorString.indexOf('@') >= 0 ? authorString.split('@')[0] : authorString;
    const contentOrganizationName = get(this, 'content.organizationName');


    if (currentOrganizationOwnsContent) {
      return get(this, 'organization.name');
    } else if (this._orgIsListserv(contentOrganizationName) || get(this, 'contentOwnedByDefaultOrganization') ) {
      return isPresent(authorName) ? authorName : contentOrganizationName;
    } else {
      return isPresent(contentOrganizationName) ? contentOrganizationName : authorName;
    }
  }),

  avatarUrl: computed('organization.{logoUrl,profileImageUrl}', 'content.avatarUrl', function() {
    const currentOrganizationOwnsContent = get(this, 'currentOrganizationOwnsContent');
    const logoUrl = get(this, 'organization.logoUrl');
    const profileImageUrl = get(this, 'organization.profileImageUrl');
    const organizationProfileImageUrl = get(this, 'content.organizationProfileImageUrl');
    const avatarUrl = get(this, 'content.avatarUrl');
    const contentOrganizationName = get(this, 'content.organizationName');

    if (currentOrganizationOwnsContent) {
      return isPresent(profileImageUrl) ? profileImageUrl : (isPresent(logoUrl) ? logoUrl : null);
    } else if (this._orgIsListserv(contentOrganizationName) || get(this, 'contentOwnedByDefaultOrganization')) {
      return isPresent(avatarUrl) ? avatarUrl : null;
    } else {
      return isPresent(organizationProfileImageUrl) ? organizationProfileImageUrl : (isPresent(avatarUrl) ? avatarUrl : null);
    }
  }),

  relativeDate: computed('content.publishedAt', function() {
    return dateFormat.relative(get(this, 'content.publishedAt'));
  }),

  fullPrice: computed('content.cost', function() {
    const cost = get(this, 'content.cost') || 'Free';//@todo: need to get price through api
    return cost;
  })
});
