import Component from '@ember/component';
import { computed, getWithDefault } from '@ember/object';

export default Component.extend({
  classNames: ['XCard'],
  classNameBindings: [
    'colorClass',
    'noShadow:XCard--noShadow',
    'noMargin:XCard--noMargin'
  ],

  color: 'default', // default, neutral, warning, danger, clear
  noShadow: false,
  noMargin: false,

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `XCard--${color}`;
  })
});
