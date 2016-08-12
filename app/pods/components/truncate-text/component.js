import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['Truncate'],

  truncatedText: computed('text', function() {
    const text = this.get('text');
    const displayTextLength = this.stripHtml(text).length;
    const maxLength = this.get('maxLength');

    if (text) {
      if (displayTextLength > maxLength) {
        const truncatedText = text.substring(0, maxLength);
        return `${truncatedText}...`;
      } else {
        return text;
      }
    }
  }),

  stripHtml: function(text) {
    const tmp = document.createElement("div");
    tmp.innerHTML = text;
    return tmp.textContent || tmp.innerText || "";
  }

});
