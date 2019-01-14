import { isPresent } from '@ember/utils';
import sanitize from 'npm:sanitize-html';
import TextArea from '@ember/component/text-area';
import $ from 'jquery';
import Mixin from '@ember/object/mixin';

export default Mixin.create({

  init() {
    TextArea.reopen({
      attributeBindings: ['style']
    });

    this._super(...arguments);
  },

  _sanitizeOutHtml(value="") {
    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: [],
      textFilter: (text) => {
        return this._textFilter(text);
      }
    };

    const strippedOfHTML = isPresent(value) ? sanitize(value, sanitizeOptions) : '';

    if (strippedOfHTML.length !== value.length) {
      return strippedOfHTML.trim();
    }

    return strippedOfHTML;
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

  _truncateValue(value="", length=100) {
    if (value.length > length) {
      return value.substring(0, length);
    } else {
      return value;
    }
  },

  _notEnterKeys(textareaEvent) {
    const blockedKeyCodes = [9, 13];

    if (blockedKeyCodes.includes(textareaEvent.keyCode)) {
      textareaEvent.preventDefault();
      return false;
    }

    return true;
  },

  actions: {
    putFocusOn(elementId) {
      const $elementToFocusOn = $(this.element).find(`#${elementId}`);

      if ($elementToFocusOn) {
        $elementToFocusOn.focus();
      }
    }
  }
});
