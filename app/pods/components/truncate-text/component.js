import Ember from 'ember';
import sanitize from 'npm:sanitize-html';

const {get, isPresent, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['Truncate'],
  classNameBindings: [
    'truncatedWithButtonVisible:Truncate--inline'
  ],

  text: null,
  maxLength: 50,
  willTruncateText: true,
  showToggleButton: false,

  isTextTruncated: computed.and('willTruncateText', 'shouldTruncateText'),
  isButtonVisible: computed.and('shouldTruncateText', 'showToggleButton'),
  truncatedWithButtonVisible: computed.and('isTextTruncated', 'isButtonVisible'),

  truncatedText: computed('text', 'isTextTruncated', 'maxLength', function() {
    const text = get(this, 'text');
    const isTextTruncated = get(this, 'isTextTruncated');
    const maxLength = get(this, 'maxLength');

    if (isTextTruncated) {
      const truncatedText = text.substring(0, maxLength);
      return `${truncatedText}...`;
    } else {
      return text;
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
