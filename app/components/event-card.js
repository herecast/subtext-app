import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Card'],

  truncatedContent: function() {
    const content = this.get('event.content');

    if (content) {
      if (content.length > 100) {
        const truncatedContent = content.substring(0, 100);
        return `${truncatedContent}...`;
      } else {
        return content;
      }
    }
  }.property('event.content')
});
