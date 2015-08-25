import Ember from 'ember';

export default Ember.Component.extend({
  contentComments: Ember.inject.service('content-comments'),
  comments: [],
  showComments: false,

  actions: {
    toggleComments() {
      this.toggleProperty('showComments');
    }
  },

  setComments: function() {
    // The content ID will only be available for persisted content, we don't
    // want to try to get comments when creating new content.
    if (this.get('contentId')) {
      this.get('contentComments').getComments(this.get('contentId')).then(comments => {
        this.set('comments', comments.toArray());
      });
    } else {
      this.set('comments', []);
    }
  }.on('didInsertElement')
});
