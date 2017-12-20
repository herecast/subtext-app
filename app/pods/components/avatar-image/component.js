import Ember from 'ember';
import computedInitials from 'subtext-ui/utils/computed-initials';
import hexColorFromString from 'subtext-ui/utils/hex-color-from-string';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';

const { get, computed, isBlank, String: { htmlSafe }  } = Ember;

export default Ember.Component.extend({
  classNames: 'AvatarImage',
  classNameBindings: ['customSize:custom-sized', 'hasCaret:has-caret'],

  imageUrl: null,
  userName: null,
  customSize: null,
  hasCaret: false,

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
      let fontSize = Math.round(0.4 * customSize);
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
      let fontSize = Math.round(0.4 * customSize);
      style = `width:${fontSize}px; right:-${fontSize}px; line-height:${customSize}px; font-size:${fontSize}px`;
    }

    return htmlSafe(style);
  }),

  optimizedImageUrlString: computed('imageUrl', 'customSize', function() {
    const imageUrl = get(this, 'imageUrl');
    const customSize = get(this, 'customSize');

    return makeOptimizedImageUrl(imageUrl, customSize, customSize, true);
  })
});
