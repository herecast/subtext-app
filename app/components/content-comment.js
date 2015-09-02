import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Comment'],
  classNameBindings: ['isActive:is-active'],
  tagName: 'li',
  attributeBindings: ['dataAnchor:data-anchor'],

  dataAnchor: function() {
    return `comment-${this.get('comment.id')}`;
  }.property('comment.id'),

  isActive: function() {
    return this.get('comment.id') === this.get('activeCommentId');
  }.property('comment.id','activeCommentId')
});
