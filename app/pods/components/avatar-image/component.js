import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isBlank, isPresent } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import computedInitials from 'subtext-app/utils/computed-initials';
import hexColorFromString from 'subtext-app/utils/hex-color-from-string';
import makeOptimizedImageUrl from 'subtext-app/utils/optimize-image-url';

export default Component.extend({
  classNames: 'AvatarImage',
  classNameBindings: ['customSize:custom-sized', 'isLogo:is-logo'],

  imageUrl: null,
  userName: null,
  customSize: null,
  isLogo: false,

  userInitials: computed('userName', function() {
    return computedInitials(get(this, 'userName'));
  }),

  avatarBackgroundColor: computed('userName', function() {
    return htmlSafe(hexColorFromString(get(this, 'userName')));
  }),

  customSizeStyle: computed('customSize', 'imageUrl', 'avatarBackgroundColor', 'isLogo', function() {
    const customSize = get(this, 'customSize');
    const imageUrl = get(this, 'imageUrl');
    let style = '';

    if (customSize) {
      const factor = get(this, 'isLogo') ? 0.45 : 0.4;
      const fontSize = Math.round(factor * customSize);
      const lineHeight = get(this, 'isLogo') ? customSize - 1 : customSize;
      style = `width:${customSize}px; height:${customSize}px; line-height:${lineHeight}px; font-size:${fontSize}px;`;
    }

    if (isBlank(imageUrl) && !get(this, 'isLogo')) {
      const avatarBackgroundColor = get(this, 'avatarBackgroundColor');
      style += `background-color: ${avatarBackgroundColor};`;
    }

    return htmlSafe(style);
  }),

  hasImageUrl: notEmpty('imageUrl'),

  optimizedImageUrlString: computed('imageUrl', 'customSize', function() {
    const imageUrl = get(this, 'imageUrl');
    const customSize = get(this, 'customSize');

    let optimizedImageUrl = null;

    if (isPresent(imageUrl)) {
      optimizedImageUrl = makeOptimizedImageUrl(imageUrl, customSize, customSize, true);
    }

    return htmlSafe(optimizedImageUrl);
  }),

  defaultClass: computed('isLogo', function() {
    return get(this, 'isLogo') ? 'AvatarImage--logo' : 'AvatarImage--default';
  })
});
