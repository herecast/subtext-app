import Ember from 'ember';

const {computed, getWithDefault} = Ember;

export default Ember.Component.extend({
  classNames: ['XTabs'],
  classNameBindings: [
    'colorClass'
  ],

  color: 'default', // 'default', 'steel-gray'

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color');
    return `XTabs--${color}`;
  })
});
