import { equal, alias, empty } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';

import moment from 'moment';
import dateFormat from 'subtext-app/lib/dates';
import Schedulable from 'subtext-app/mixins/models/schedulable';
import HasVenue from 'subtext-app/mixins/models/has-venue';
import HasImages from 'subtext-app/mixins/models/has-images';

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
  clickCount: attr('number'),
  commentCount: attr('number'),
  contactEmail: attr('string'),
  contactPhone: attr('string'),
  content: attr('string'),
  contentOrigin: attr('string'),
  contentType: attr('string'),
  cost: attr('string'),
  embeddedAd: attr('boolean', {defaultValue: true}),
  likeCount: attr('number'),
  redirectUrl: attr('string'),
  shortLink: attr('string'),
  sold: attr('boolean', {defaultValue: false}),
  splitContent: attr(),
  subtitle: attr('string'),
  title: attr('string'),
  url: attr('string'),
  viewCount: attr('number'),

  createdAt: attr('moment-date'),
  publishedAt: attr('moment-date', {defaultValue: null}),
  updatedAt: attr('moment-date'),

  deleted: attr('boolean', {defaultValue: false}),
  removed: attr('boolean', {defaultValue: false}),
  // </FIELDS>


  // <RELATIONSHIPS>
  comments: hasMany('comment'),
  location: belongsTo('location'),
  locationId: alias('location.id'),

  caster: belongsTo('caster'),
  casterId: alias('caster.id'),
  casterName: alias('caster.name'),
  casterHandle: alias('caster.handle'),
  casterAvatarImageUrl: alias('caster.avatarImageUrl'),
  // </RELATIONSHIPS>

  contentId: alias('id'),
  isEvent: equal('contentType', 'event'),
  isNews: equal('contentType', 'news'),
  isMarket: equal('contentType', 'market'),

  isHiddenFromFeed: attr('boolean', {defaultValue: false}),

  baseLocation: computed('location', 'contentType', 'venueCity', 'venueState}', function() {
    const contentType = get(this, 'contentType');
    let city = null;
    let state = null;

    if (contentType === 'event') {
      city = get(this, 'venueCity');
      state = get(this, 'venueState');
    } else {
      const location = get(this, 'location');

      if (isPresent(location)) {
        city = get(location, 'city');
        state = get(location, 'state');
      }
    }

    return {city, state};
  }),

  publishedAtRelative: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');
    return isPresent(publishedAt) ? dateFormat.relative(publishedAt) : null;
  }),

  attributionLinkId: computed('casterHandle', function() {
    return `@${get(this, 'casterHandle')}`;
  }),
  attributionImageUrl: alias('casterAvatarImageUrl'),
  attributionName: computed('caster.attributionName', 'casterName', 'casterHandle', function() {
    if (isPresent(get(this, 'caster.attributionName'))) {
      return get(this, 'caster.attributionName');
    }

    if (isPresent(get(this, 'casterName'))) {
      return get(this, 'casterName');
    }

    return `@${get(this, 'casterHandle')}`;
  }),

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

  hasBeenDeleted: alias('deleted'),
  hasBeenRemoved: alias('removed'),

  hasUnpublishedChanges: computed('isSaving', 'isPublished', 'isScheduled', 'hasDirtyAttributes', 'dirtyType', 'didLocationChange', function() {
    const isScheduledOrPublished = (get(this, 'isPublished') || get(this, 'isScheduled'));
    const isNew = (get(this, 'dirtyType') === 'created');

    return isScheduledOrPublished &&
      ((get(this, 'hasDirtyAttributes') && !isNew) || get(this, 'didLocationChange')) &&
      (!get(this, 'isSaving'));
  }),

  // Since Ember Data does not set hasDirtyAttributes to true when a child relationship changes
  didLocationChange: false
});
