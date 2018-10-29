import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { computed, setProperties, set, get } from '@ember/object';

/**
 * This component should not be used directly. Rather, it should be used
 * inside of a sticky-container as a contextual component.
 */
export default Component.extend({
  classNames: ['StickyItem-wrapper'],
  classNameBindings: ['activeClassName'],
  attributeBindings: ['style'],

  originalTopOffset: null,
  originalHeight: null,
  enabled: true,

  stickyBuffer: 0,

  topPosition: null,
  isSticky: false,
  isHidden: false,
  useAbsolutePositioning: false,
  maintainStickyItemSpace: true,

  activeClass: '',
  inactiveClass: '',

  toggleCaption: function() {},

  activeClassName: computed('isSticky', 'activeClass', function() {
    return get(this, 'isSticky') ? get(this, 'activeClass') : get(this, 'inactiveClass');
  }),

  style: computed('originalHeight', function() {
    // The parent wrapper must maintain the height of the StickyItem
    // to prevent the elements in the DOM from jumping around
    const height = get(this, 'maintainStickyItemSpace') ? `height:${get(this, 'originalHeight')}px` : '';
    return htmlSafe(height);
  }),

  stickyItemStyle: computed('topPosition', 'isHidden', 'isSticky', 'useAbsolutePositioning', function() {
    const topPosition = get(this, 'topPosition');
    let style = '';

    if (topPosition !== null) {
      style += `top:${get(this, 'topPosition')}px;`;
    }

    if (get(this, 'isHidden')) {
      style += 'display: none;';
    }

    if (get(this, 'isSticky')) {
      style += `position: ${get(this, 'useAbsolutePositioning') ? 'absolute' : 'fixed'};`;
    }

    return htmlSafe(style);
  }),

  getOffsetTop() {
    return this.$().offset().top;
  },

  didInsertElement() {
    this._super(...arguments);
    if (get(this, 'enabled')) {
      // Save the initial position and height of the element
      const $this = this.$();

      setProperties(this, {
        originalTopOffset: $this.offset().top,
        originalHeight: $this.outerHeight()
      });
    }
  },

  willDestroyElement() {
    if (get(this, 'enabled')) {
      // Remove the element from its container
      const removeItem = get(this, 'removeItem');
      if (removeItem) {
        removeItem(this);
      }
    }
  },

  init() {
    this._super(...arguments);

    if (get(this, 'enabled')) {
      // Register the element with its container
      const registerItem = get(this, 'registerItem');
      if (registerItem) {
        registerItem(this);
      }
    }
  },

  stickItem(topPosition) {
    setProperties(this, {
      topPosition,
      isSticky: true,
      isHidden: false
    });
    this.toggleCaption('hide');
  },

  resetPositioning() {
    setProperties(this, {
      topPosition: null,
      isSticky: false,
      isHidden: false
    });
    this.toggleCaption('unhide');
  },

  hide() {
    set(this, 'isHidden', true);
  }
});
