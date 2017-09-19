import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ContentBody'],
  classNameBindings: [
    'verticalPadding:ContentBody--verticalPadding'
  ],

  verticalPadding: false
});
