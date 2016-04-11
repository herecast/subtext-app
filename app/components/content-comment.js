import Ember from 'ember';

const { computed, on } = Ember;

export default Ember.Component.extend({
  classNames: ['Comment'],
  classNameBindings: ['isActive:is-active'],
  tagName: 'li',
  attributeBindings: ['dataAnchor:data-anchor', 'data-test-content-comment'],
  'data-test-content-comment': Ember.computed.oneWay('comment.id'),

  dataAnchor: computed('comment.id', function() {
    return `comment-${this.get('comment.contentId')}`;
  }),

  isActive: computed('comment.id','activeCommentId', function() {
    return Ember.isPresent(this.get('activeCommentId')) && this.get('comment.contentId') === this.get('activeCommentId');
  }),

  notifyParentOfRender: on('didInsertElement', function() {
    this.sendAction('afterRender');
  })
});
