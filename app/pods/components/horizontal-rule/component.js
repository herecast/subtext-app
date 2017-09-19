import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['HorizontalRule'],
  classNameBindings: [
    'short:HorizontalRule--short'
  ],

  short: false,
});
