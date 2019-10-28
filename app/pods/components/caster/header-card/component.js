import { get, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import { optimizedImageUrl } from 'subtext-app/helpers/optimized-image-url';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-HeaderCard'],
  classNameBindings: ['useShadow:with-shadow'],
  'data-test-component': 'caster-header-card',

  caster: null,

  useShadow: false,

  handle: readOnly('caster.handle'),

  avatarImageUrl: readOnly('caster.avatarImageUrl'),
  avatarImageSrc: computed('avatarImageUrl', function() {
    const avatarImageUrl = get(this, 'avatarImageUrl');

    if (avatarImageUrl) {
      const options = [avatarImageUrl, 150, 150, true];

      return optimizedImageUrl(options);
    }

    return 'https://s3.amazonaws.com/subtext-misc/createapage/generic-profile-picture.jpg';
  }),

  backgroundImageUrl: readOnly('caster.backgroundImageUrl'),
  backgroundImageStyle: computed('backgroundImageUrl', function() {
    const backgroundImageUrl = get(this, 'backgroundImageUrl') || '/images/caster_default_background_500x300.jpg';

    if (backgroundImageUrl) {
      const options = [backgroundImageUrl, 1280, 720, false];

      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return htmlSafe(`background: rgba(255,255,255,1);`);
  }),

  followerLanguage: computed('caster.activeFollowersCount', function() {
    if (get(this, 'caster.activeFollowersCount') === 1) {
      return 'Follower';
    }

    return 'Followers'
  })
});
