import Ember from 'ember';

const {computed, getWithDefault} = Ember;

export default Ember.Component.extend({
  classNames: ['XTabs'],
  classNameBindings: [
    'colorClass',
    'noBottomBorder:XTabs--noBottomBorder'
  ],

  color: 'default', // 'default', 'neutral'
  noBottomBorder: false,

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `XTabs--${color}`;
  })
});
