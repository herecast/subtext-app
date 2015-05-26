import Ember from 'ember';

export default Ember.Component.extend({

  truncatedText: function() {
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
  }.property('text'),

  stripHtml: function(text) {
    const tmp = document.createElement("div");
    tmp.innerHTML = text;
    return tmp.textContent || tmp.innerText || "";
  }

});
