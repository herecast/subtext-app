import Component from '@ember/component';
import { isBlank, isPresent } from '@ember/utils';
import { computed, set, get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import sanitize from 'npm:sanitize-html';

export default Component.extend({
  classNames: ['ImageEditor'],

  _selectedImage: null,
  _originalImageUrl: null,

  notify: service('notification-messages'),

  // Should be set when component is instantiated
  imageUrl: null,
  caption: null,

  title: 'Upload Image',
  aspectRatio: 4 / 3,
  enableCaption: true,
  captionInFocus: false,

  imageFormVisible: false,

  maxCaptionLength: 140,
  captionLength: computed('caption.length', function() {
    return get(this, 'caption.length') || 0;
  }),
  hasCaption: notEmpty('caption'),

  needsImage: computed('_originalImageUrl', function() {
    return isBlank(get(this, '_originalImageUrl'));
  }),

  saveDisabled: computed('_originalImageUrl', '_selectedImage', function() {
    return isBlank(get(this, 'imageUrl')) && isBlank(get(this, '_selectedImage'));
  }),

  init() {
    this._super();
    set(this, '_originalImageUrl', get(this, 'imageUrl'));
  },

  _sanitizeCaption() {
    const caption = get(this, 'caption') || '';
    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: [],
      textFilter: (text) => {
        return this._textFilter(text);
      }
    };
    const strippedOfHTML = isPresent(caption) ? sanitize(caption, sanitizeOptions) : '';

    if (caption.length !== strippedOfHTML.length) {
      set(this, 'caption', strippedOfHTML.trim());
      get(this, 'notify').warning('HTML elements and tags are not allowed in captions.');
    }
  },

  _textFilter(text) {
    const allowedSpecialCharacters = {
       "&quot;": '"',
       "&amp;": '&',
       "&lt;": '<',
       "&gt;": '>'
    };
    const regex = new RegExp(Object.keys(allowedSpecialCharacters).join("|"),"gi");

    return text.replace(regex, function(matched){
      return allowedSpecialCharacters[matched];
    });
  },

  _truncateCaption() {
    const caption = get(this, 'caption') || '';
    const maxCaptionLength = get(this, 'maxCaptionLength');

    if (get(this, 'caption.length') > maxCaptionLength) {
      set(this, 'caption', caption.substring(0, maxCaptionLength));
    }
  },

  actions: {
    cancel() {
      set(this, 'imageUrl', get(this, '_originalImageUrl'));
      get(this, 'cancel')();
    },

    save() {
      //NOTE need to check why this is not getting set for test
      const selectedImage = get(this, '_selectedImage'),
        imageUrl = get(this, 'imageUrl'),
        caption = get(this, 'caption') || '';
      get(this, 'save')(selectedImage, caption, imageUrl);
    },

    showImageForm() {
      set(this, 'imageFormVisible', true);
    },

    captionChanging() {
      this._sanitizeCaption();
      this._truncateCaption();
    },

    onFocusIn() {
      set(this, 'captionInFocus', true);
    },
    onFocusOut() {
      set(this, 'captionInFocus', false);
    },

    checkKeys(textareaEvent) {
      const blockedKeyCodes = [9, 13];

      if (blockedKeyCodes.includes(textareaEvent.keyCode)) {
        textareaEvent.preventDefault();
      }
    },
  }
});
