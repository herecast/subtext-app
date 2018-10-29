import Component from '@ember/component';

export default Component.extend({
  classNames: ['HorizontalRule'],
  classNameBindings: [
    'short:HorizontalRule--short'
  ],

  short: false,
});
