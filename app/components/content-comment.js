import { isPresent } from '@ember/utils';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  classNames: ['Comment'],
  classNameBindings: ['isActive:is-active'],
  tagName: 'li',
  attributeBindings: ['dataAnchor:data-anchor', 'data-test-content-comment', 'data-test-component'],
  'data-test-content-comment': oneWay('comment.id'),

  hideReportAbuse: false,
  comment: null,

  commentContent: computed('comment.content', function() {
    return htmlSafe(get(this, 'comment.content'));
  }),

  dataAnchor: computed('comment.id', function() {
    return `comment-${get(this, 'comment.contentId')}`;
  }),

  isActive: computed('comment.id','activeCommentId', function() {
    return isPresent(get(this, 'activeCommentId')) && get(this, 'comment.contentId') === get(this, 'activeCommentId');
  })
});
