import Ember from 'ember';

export default Ember.Component.extend({
  contentComments: Ember.inject.service('content-comments'),
  comments: [],

  setComments: function() {
    this.get('contentComments').getComments(this.get('contentId')).then(comments => {
      comments.forEach(comment => {
        this.get('comments').pushObject(comment);
      });
    });

  }.on('didInsertElement')
});
