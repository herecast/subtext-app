import { equal, alias, notEmpty, empty } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';

import moment from 'moment';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import dateFormat from 'subtext-ui/lib/dates';
import Schedulable from 'subtext-ui/mixins/models/schedulable';
import HasVenue from 'subtext-ui/mixins/models/has-venue';
import HasImages from 'subtext-ui/mixins/models/has-images';

const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend(
  Schedulable,
  HasVenue,
  HasImages,
  {
  // <FIELDS>
  authorId: attr('number'),
  authorName: attr('string'),
  avatarUrl: attr('string'),
  bizFeedPublic: attr('boolean', {defaultValue: true, allowNull: true}),
  campaignEnd: attr('moment-date'),
  campaignStart: attr('moment-date'),
  clickCount: attr('number'),
  commentCount: attr('number'),
  contactEmail: attr('string'),
  contactPhone: attr('string'),
  content: attr('string'),
  contentOrigin: attr('string'), //NOTE:Only relevant to feed-content and possibly event-instance. Double-check how contentOrigin is being used across the site
  contentType: attr('string'),
  cost: attr('string'),
  createdAt: attr('moment-date'),
  embeddedAd: attr('boolean', {defaultValue: true}),
  listservIds: attr('raw', {defaultValue: () => { return []; }}),
  organizationBizFeedActive: attr('boolean', {defaultValue: false}),
  organizationId: attr('number'),
  organizationName: attr('string'),
  organizationProfileImageUrl: attr('string'),
  parentContentId: attr('number'), //TAG:NOTE can be removed after dashboard is removed (was a talk model property)
  parentContentType: attr('string'), //TAG:NOTE can possibly be removed after dashboard is removed (was a talk model property)
  parentEventInstanceId: attr('number'), //TAG:NOTE can possibly be removed after dashboard is removed
  publishedAt: attr('moment-date', {defaultValue: null}),
  redirectUrl: attr('string'),
  shortLink: attr('string'),
  sold: attr('boolean', {defaultValue: false}),
  splitContent: attr(),
  subtitle: attr('string'),
  sunsetDate: attr('moment-date'),
  title: attr('string'),
  updatedAt: attr('moment-date'),
  url: attr('string'),
  viewCount: attr('number'),
  // </FIELDS>


  // <RELATIONSHIPS>
  comments: hasMany('comment', {inverse: null}),
  location: belongsTo('location'),
  //locationId: attr('number'),
  locationId: alias('location.id'),
  organization: belongsTo('organization', {async: true}),
  // </RELATIONSHIPS>


  contentId: alias('id'),
  isEvent: equal('contentType', 'event'),
  isNews: equal('contentType', 'news'),
  isMarket: equal('contentType', 'market'),
  isCampaign: equal('contentType', 'campaign'),

  listsEnabled: notEmpty('listservIds'),

  baseLocationName: computed('location', function() {
    const location = get(this, 'location');

    if (isPresent(location)) {
      return get(location, 'name');
    }

    return null;
  }),

  publishedAtRelative: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    return isPresent(publishedAt) ? dateFormat.relative(publishedAt) : null;
  }),

  isOwnedByOrganization: computed('isNews', 'organizationId', function() {
    const isNews = get(this, 'isNews');
    const organizationId = get(this, 'organizationId');
    const organizationIsDefaultOrganization = isDefaultOrganization(organizationId);

    if (isNews) {
      return true;
    } else if (organizationIsDefaultOrganization) {
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

  attributionLinkId: alias('organizationId'),

  attributionImageUrl: computed('isNews', 'organizationId', 'organizationProfileImageUrl', 'avatarUrl', function() {
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

  attributionName: computed('isNews', 'organizationId', 'organizationName', 'authorName', function() {
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

  /* BEGIN Biz/org/content-management properties */
  campaignIsActive: computed('campaignStart', 'campaignEnd', function() {
    const campaignStart = moment(get(this, 'campaignStart'));
    const campaignEnd = moment(get(this, 'campaignEnd'));

    return moment().isAfter(campaignStart) && moment().isBefore(campaignEnd);
  }),

  viewStatus: computed('publishedAt', 'bizFeedPublic', 'campaignIsActive', function() {
    const isDraft = get(this, 'isDraft');
    const isScheduled = get(this, 'isScheduled');

    if (isDraft || isScheduled) {
      return 'draft';
    }

    const bizFeedPublic = get(this, 'bizFeedPublic');
    let isPublic = isPresent(bizFeedPublic) ? bizFeedPublic : true;

    if (get(this, 'contentType') === 'campaign' && !isPresent(isPublic)) {
      isPublic = get(this, 'campaignIsActive');
    }

    return isPublic ? 'public' : 'private';
  }),

  /* END Biz/org/content-management properties */

  isPublic: equal('viewStatus', 'public'),

  isDraft: empty('publishedAt'),

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

  hasUnpublishedChanges: computed('isSaving', 'isPublished', 'isScheduled', 'hasDirtyAttributes', 'didOrgChange', 'dirtyType', 'didLocationChange', function() {
    const isScheduledOrPublished = (get(this, 'isPublished') || get(this, 'isScheduled'));
    const isNew = (get(this, 'dirtyType') === 'created');

    return isScheduledOrPublished &&
      ((get(this, 'hasDirtyAttributes') && !isNew) || get(this, 'didOrgChange') || get(this, 'didLocationChange')) &&
      (!get(this, 'isSaving'));
  }),

  // Used to notify hasUnpublishedChanges when a new organization is changed
  // Since Ember Data does not set hasDirtyAttributes to true when a child relationship changes
  didOrgChange: false,
  didLocationChange: false
});
