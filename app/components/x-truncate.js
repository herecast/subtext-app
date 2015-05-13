import Ember from 'ember';

export default Ember.Component.extend({

  truncatedText: function() {
    const text = this.get('text');
    const maxLength = this.get('maxLength');

    if (text) {
      if (text.length > maxLength) {
        const truncatedText = text.substring(0, maxLength);
        return `${truncatedText}...`;
      } else {
        return text;
      }
    }
  }.property('text')

});
