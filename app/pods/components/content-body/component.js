import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ContentBody'],
  classNameBindings: [
    'verticalPadding:ContentBody--verticalPadding',
    'center:ContentBody--center',
    'wideGutters:ContentBody--wideGutters',
    'increaseBottomPadding:ContentBody--increaseBottomPadding',
    'noBottomPadding:ContentBody--noBottomPadding',
    'background:ContentBody--background'
  ],

  verticalPadding: false,
  center: false,
  wideGutters: false,
  increaseBottomPadding: false,
  noBottomPadding: false,
  background: false,
});
