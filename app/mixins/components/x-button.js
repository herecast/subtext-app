import Ember from 'ember';

const {get, getWithDefault, computed} = Ember;

export default Ember.Mixin.create({
  tagName: 'button',
  classNames: ['XButton'],
  classNameBindings: [
    'colorClass',
    'styleClass',
    'sizeClass',
    'blockTypeClass',
    'xsStyleClass',
    'xsSizeClass',
    'xsBlockTypeClass'
  ],
  attributeBindings: ['type'],
  type: 'button',

  color: 'default', // 'default', 'primary', 'secondary', 'danger'
  style: 'regular', // 'regular', 'inverted', 'outline, 'lighten', 'gray', 'link'
  size: 'small', // 'x-small', 'small', 'medium', 'large'
  blockType: null, // 'wide'

  // optional: set a specific style on mobile.
  xsStyle: null,
  xsSize: null,
  xsBlockType: null,

  colorClass: computed('color', function() {
    const color = getWithDefault(this, 'color', 'default');
    return `XButton--${color}`;
  }),

  styleClass: computed('style', function() {
    const style = getWithDefault(this, 'style', 'regular');
    return `XButton--${style}`;
  }),

  sizeClass: computed('size', function() {
    const size = getWithDefault(this, 'size', 'small');
    return `XButton--${size}`;
  }),

  blockTypeClass: computed('blockType', function() {
    const blockType = get(this, 'blockType');
    return (blockType) ? `XButton--${blockType}` : null;
  }),

  xsStyleClass: computed('xsStyle', function() {
    const style = get(this, 'xsStyle');
    return (style) ? `XButton--xs-${style}` : null;
  }),

  xsSizeClass: computed('xsSize', function() {
    const size = get(this, 'xsSize');
    return (size) ? `XButton--xs-${size}` : null;
  }),

  xsBlockTypeClass: computed('blockType', function() {
    const xsBlockType = get(this, 'xsBlockType');
    return (xsBlockType) ? `XButton--xs-${xsBlockType}` : null;
  })

});
