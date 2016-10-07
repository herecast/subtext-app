import Ember from 'ember';
import computedInitials from 'subtext-ui/utils/computed-initials';
import hexColorFromString from 'subtext-ui/utils/hex-color-from-string';

const { get, set, computed, String: { htmlSafe }  } = Ember;

export default Ember.Component.extend({
  classNames: 'AvatarImage',
  classNameBindings: ['customSized:custom-sized', 'hasCaret:has-caret'],

  imageUrl: null,
  userName: null,
  customSize: null,
  hasCaret: false,

  userInitials: computed('userName', function() {
    return computedInitials(get(this, 'userName'));
  }),

  avatarBackgroundColor: computed('userName', function() {
    return hexColorFromString(get(this, 'userName'));
  }),

  customSizeStyle: computed('customSize', function() {
    const customSize = get(this, 'customSize');
    let style = '';

    if (customSize) {
      let fontSize = Math.round(0.4 * customSize);
      style = `width:${customSize}px; height:${customSize}px; line-height:${customSize}px; font-size:${fontSize}px`;
      set(this, 'customSized', true);
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
  })
});
