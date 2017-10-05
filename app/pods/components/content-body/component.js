import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ContentBody'],
  classNameBindings: [
    'verticalPadding:ContentBody--verticalPadding',
    'increaseBottomPadding:ContentBody--increaseBottomPadding'
  ],

  verticalPadding: false,
  increaseBottomPadding: false
});
