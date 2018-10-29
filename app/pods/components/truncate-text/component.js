import { and } from '@ember/object/computed';
import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed, get } from '@ember/object';
import sanitize from 'npm:sanitize-html';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  classNames: ['Truncate'],
  classNameBindings: [
    'truncatedWithButtonVisible:Truncate--inline'
  ],

  text: null,
  maxLength: 50,
  willTruncateText: true,
  showToggleButton: false,

  isTextTruncated: and('willTruncateText', 'shouldTruncateText'),
  isButtonVisible: and('shouldTruncateText', 'showToggleButton'),
  truncatedWithButtonVisible: and('isTextTruncated', 'isButtonVisible'),

  truncatedText: computed('text', 'isTextTruncated', 'maxLength', function() {
    const text = get(this, 'text');
    const isTextTruncated = get(this, 'isTextTruncated');
    const maxLength = get(this, 'maxLength');

    if (isTextTruncated) {
      const truncatedText = text.substring(0, maxLength);
      return htmlSafe(`${truncatedText}...`);
    } else {
      return htmlSafe(text);
    }
  }),

  shouldTruncateText: computed('text', 'maxLength', function() {
    const text = get(this, 'text');
    const displayTextLength = this.stripHtml(text).length;
    const maxLength = this.get('maxLength');

    return (isPresent(text) && displayTextLength > maxLength);
  }),

  stripHtml: function(text) {
    return sanitize(text, {
      allowedTags: [],
      allowedAttributes: []
    });
  },

  actions: {
    toggleTruncatedText() {
      this.toggleProperty('willTruncateText');
    }
  }

});
