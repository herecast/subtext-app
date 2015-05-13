import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Card'],

  truncatedTitle: function() {
    const title = this.get('event.title');

    if (title) {
      if (title.length > 35) {
        const truncatedtitle = title.substring(0, 35);
        return `${truncatedtitle}...`;
      } else {
        return title;
      }
    }
  }.property('event.title'),

  truncatedContent: function() {
    const content = this.get('event.content');

    if (content) {
      if (content.length > 90) {
        const truncatedContent = content.substring(0, 90);
        return `${truncatedContent}...`;
      } else {
        return content;
      }
    }
  }.property('event.content')
});
