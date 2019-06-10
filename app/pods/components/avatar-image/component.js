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
  classNameBindings: ['customSize:custom-sized', 'hasCaret:has-caret', 'isSquare:is-square'],

  imageUrl: null,
  userName: null,
  customSize: null,
  hasCaret: false,
  isSquare: false,

  userInitials: computed('userName', function() {
    return computedInitials(get(this, 'userName'));
  }),

  avatarBackgroundColor: computed('userName', function() {
    return htmlSafe(hexColorFromString(get(this, 'userName')));
  }),

  customSizeStyle: computed('customSize', 'imageUrl', 'avatarBackgroundColor', function() {
    const customSize = get(this, 'customSize');
    const imageUrl = get(this, 'imageUrl');
    let style = '';

    if (customSize) {
      const factor = get(this, 'isSquare') ? 0.5 : 0.4;
      let fontSize = Math.round(factor * customSize);
      style = `width:${customSize}px; height:${customSize}px; line-height:${customSize}px; font-size:${fontSize}px;`;
    }

    if (isBlank(imageUrl)) {
      const avatarBackgroundColor = get(this, 'avatarBackgroundColor');
      style += `background-color: ${avatarBackgroundColor};`;
    }

    return htmlSafe(style);
  }),

  customCaretStyle: computed('hasCaret', function() {
    const customSize = get(this, 'customSize');
    let style = '';

    if (get(this, 'hasCaret')) {
      const factor = get(this, 'isSquare') ? 0.5 : 0.4;
      let fontSize = Math.round(factor * customSize);
      style = `width:${fontSize}px; right:-${fontSize}px; line-height:${customSize}px; font-size:${fontSize}px`;
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
  })
});
