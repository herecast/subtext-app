import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['BusinessFeedbackBadge'],

  isPlural: computed('result.feedback_num', function() {
    const feedback_num = get(this, 'result.feedback_num');
    return feedback_num === 0 || feedback_num > 1;
  })
});
