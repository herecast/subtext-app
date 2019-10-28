import { notEmpty, oneWay, readOnly } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'FeedCard-Attribution',
  classNameBindings: ['isOnDetailView:detail-view',
                      'showCenter:has-center',
                      'casterOnly:caster-only',
                      'casterHasNoSpaces:long-namge-string'],

  model: null,
  hidePostedTime: false,
  linkToDetailIsActive: true,
  hideActivity: false,
  casterOnly: false,
  showCenter: false,
  noPadding: false,
  customSize: 40,
  truncatedAt: false,
  showAnyViewCount: false,
  hideFollowers: false,

  caster: oneWay('model.caster'),
  avatarImageUrl: oneWay('caster.avatarImageUrl'),
  attributionName: oneWay('caster.attributionName'),

  linkRouteName: 'caster',
  linkId: oneWay('model.attributionLinkId'),
  contentId: oneWay('model.contentId'),
  eventInstanceId: oneWay('model.eventInstanceId'),

  followerCount: readOnly('caster.activeFollowersCount'),

  showFollowers: computed('hideFollowers', 'followerCount', function() {
    const followerCount = parseInt(get(this, 'followerCount')) || 0;
    const hideFollowers = get(this, 'hideFollowers');
    return !hideFollowers && followerCount > 1;
  }),

  attributionNameHasNoSpaces: computed('attributionName', function() {
    const name = get(this, 'attributionName') || '';
    return name.indexOf(' ') < 0;
  }),

  hasLinkRouteName: notEmpty('linkRouteName'),

  attributionNameFormatted: computed('attributionName', function() {
    let name = get(this, 'attributionName') || '';
    const truncatedAt = get(this, 'truncatedAt') || false;

    if (truncatedAt && name.length >= truncatedAt) {
      name = name.substring(0, truncatedAt - 3) + '...';
    }

    return name;
  })
});
