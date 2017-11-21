import Ember from 'ember';

const {
  getWithDefault,
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['XCard'],
  classNameBindings: [
    'colorClass',
    'noShadow:XCard--noShadow',
    'noMargin:XCard--noMargin'
  ],

  color: 'default', // default, neutral, warning, danger
  noShadow: false,
  noMargin: false,

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `XCard--${color}`;
  })
});
