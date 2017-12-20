import Ember from 'ember';

const {get, computed} = Ember;

/**
 * Reusable block of text to enable consistent styling and behavior across the app.
 * Rather than using utility classes or duplicative css classes,
 * this enables consistency and a common interface for rendering blocks of text.
 */
export default Ember.Component.extend({
  tagName: 'p',
  classNames: ['TextBlock'],
  classNameBindings: [
    'center:TextBlock--center',
    'hasMargin::TextBlock--noMargin',
    'topMargin:TextBlock--topMargin',
    'lighten:TextBlock--lighten',
    'sizing',
    'colorClass',
    'strongClass'
  ],

  // Public interface for styling
  // Note: be careful not to add too many params here, or we are no better than inline styles!
  center: false,
  hasMargin: true,
  strong: false,

  // Font Size
  small: false,
  medium: false,
  large: false,

  color: 'default', // primary, danger

  size: computed('small', 'medium', 'large', function() {
    if (get(this, 'small')) {
      return 'small';
    } else if (get(this, 'medium')) {
      return 'medium';
    } else if (get(this, 'large')) {
      return 'large';
    } else {
      return 'medium';
    }
  }),

  sizing: computed('size', function() {
    const size = get(this, 'size');
    return `TextBlock--${size}`;
  }),

  colorClass: computed('color', function() {
    const color = get(this, 'color');
    return `TextBlock--${color}`;
  }),

  strongClass: computed('strong', function() {
    return get(this, 'strong') ? 'TextBlock--strong' : null;
  })
});
