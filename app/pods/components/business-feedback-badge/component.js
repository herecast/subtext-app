import Ember from 'ember';

const {get} = Ember;

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['BusinessFeedbackBadge'],

  isPlural: Ember.computed('result.feedback_num', function() {
    const feedback_num = get(this, 'result.feedback_num');
    return feedback_num === 0 || feedback_num > 1;
  })
});
