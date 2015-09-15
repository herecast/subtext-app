import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Comment'],
  classNameBindings: ['isActive:is-active'],
  tagName: 'li',
  attributeBindings: ['dataAnchor:data-anchor'],

  dataAnchor: function() {
    return `comment-${this.get('comment.contentId')}`;
  }.property('comment.id'),

  isActive: function() {
    return Ember.isPresent(this.get('activeCommentId')) && this.get('comment.contentId') === this.get('activeCommentId');
  }.property('comment.id','activeCommentId'),

  notifyParentOfRender: function() {
    this.sendAction('afterRender');
  }.on('didInsertElement')
});
