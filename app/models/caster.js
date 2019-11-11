import { get, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  //PUBLIC ATTRIBUTES
  avatarImageUrl: attr('string'),
  backgroundImageUrl: attr('string'),

  name: attr('string'),
  handle: attr('string'),
  userId: attr('number'),
  casterId: readOnly('userId'),
  description: attr('string'),
  phone: attr('string'),
  email: attr('string'),
  emailIsPublic: attr('boolean', {defaultValue: false}),

  website: attr('string'),
  location: belongsTo('location'),
  locationId: computed('location', function() {
    const location = get(this, 'location');
    if (isPresent(location)) {
      return get(location, 'id');
    }
    return null;
  }),

  activeFollowersCount: attr('number'),
  totalCommentCount: attr('number'),
  totalLikeCount: attr('number'),
  totalPostCount: attr('number'),
  totalViewCount: attr('number'),

  canBeContacted: computed('email', 'emailIsPublic', 'phone', function() {
    const canUseEmail = isPresent(get(this, 'email')) && get(this, 'emailIsPublic');
    const hasPhone = isPresent(get(this, 'phone'));

    return canUseEmail || hasPhone;
  }),

  casterPageLinkId: computed('handle', function() {
    return `@${get(this, 'handle')}`;
  }),

  attributionName: computed('name', 'handle', function() {
    if (isPresent(get(this, 'name'))) {
      return get(this, 'name');
    }

    return `@${get(this, 'handle')}`;
  }),


  //PRIVATE ATTRIBUTES (available if caster matches current_user)
  feedCardSize: attr('string', {defaultValue: 'midsize'}),
  userHideCount: attr('number'),

  //RELATIONSHIPS -- PRIVATE
  likes: hasMany('like'),
  casterFollows: hasMany('caster-follow'),
  casterHides: hasMany('caster-hide'),


  //INTERNAL MATCH TO current_user
  session: service(),
  currentUser: readOnly('session.currentUser'),
  isCurrentUser: computed('session.isAuthenticated', 'currentUser.userId', 'userId', function() {
    if (get(this, 'session.isAuthenticated')) {
      return get(this, 'currentUser.userId') === get(this, 'userId');
    }

    return false;
  })
});
