import Component from '@ember/component';
import { getWithDefault, computed } from '@ember/object';

export default Component.extend({
  classNames: ['XTabs'],
  classNameBindings: [
    'colorClass',
    'noBottomBorder:XTabs--noBottomBorder'
  ],

  // button styles are passed-through to contextual components for convenience
  color: 'default', // 'default', 'primary', 'secondary', 'attention', 'danger', 'light-gray', 'flatten', 'black', 'neutral'
  style: 'tab', // 'regular', 'inverted', 'outline, 'lighten', 'gray', 'link', 'tab', 'transparent'
  size: 'small', // 'x-small', 'small', 'medium', 'large'
  rounded: false,

  noBottomBorder: false,

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `XTabs--${color}`;
  })
});
