import Ember from 'ember';

const {get, computed, isPresent} = Ember;

export default Ember.Component.extend({
  classNames: ['ContentContainer'],
  classNameBindings: [
    'center:ContentContainer--center',
    'hasGutter:ContentContainer--hasGutter:ContentContainer--noGutter',
    'fluid:ContentContainer--fluid:ContentContainer--fixed',
    'sizing'
  ],

  // Public interface for styling
  // Note: be careful not to add too many params here, or we are no better than inline styles!
  center: false,
  hasGutter: false,
  fluid: true,

  // Container Size
  tiny: false,
  xsmall: false,
  small: false,
  medium: false,
  large: false,

  size: computed('tiny', 'xsmall', 'small', 'medium', 'large', function() {
    if (get(this, 'tiny')) {
      return 'tiny';
    } else if (get(this, 'xsmall')) {
      return 'xsmall';
    } else if (get(this, 'small')) {
      return 'small';
    } else if (get(this, 'medium')) {
      return 'medium';
    } else if (get(this, 'large')) {
      return 'large';
    } else {
      return null;
    }
  }),

  sizing: computed('size', function() {
    const size = get(this, 'size');
    if (isPresent(size)) {
      return `ContentContainer--${size}`;
    }
    return null;
  })
});
