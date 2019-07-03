import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['ContentBody'],
  classNameBindings: [
    'verticalPadding:ContentBody--verticalPadding',
    'center:ContentBody--center',
    'wideGutters:ContentBody--wideGutters',
    'increaseBottomPadding:ContentBody--increaseBottomPadding',
    'noBottomPadding:ContentBody--noBottomPadding',
    'background:ContentBody--background',
    'shadow:ContentBody--withBoxShadow'
  ],

  verticalPadding: false,
  center: false,
  wideGutters: false,
  increaseBottomPadding: false,
  noBottomPadding: false,
  background: false,
  shadow: false
});
