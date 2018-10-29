import Component from '@ember/component';
import { computed, get } from '@ember/object';

/**
 * Groups multiple `x-button` components together,
 * leaving one border between each button and only the ends of the group are rounded
 */
export default Component.extend({
  classNames: ['XButtonGroup'],
  classNameBindings: [
    'blockTypeClass',
    'xsBlockTypeClass'
  ],

  blockType: null, // 'wide'
  xsBlockType: null,

  blockTypeClass: computed('blockType', function() {
    const blockType = get(this, 'blockType');
    return (blockType) ? `XButtonGroup--${blockType}` : null;
  }),

  xsBlockTypeClass: computed('xsBlockType', function() {
    const xsBlockType = get(this, 'xsBlockType');
    return (xsBlockType) ? `XButtonGroup--xs-${xsBlockType}` : null;
  })
});
