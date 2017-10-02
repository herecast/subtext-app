import Ember from 'ember';

const {get, set, setProperties, computed} = Ember;

/**
 * This component should not be used directly. Rather, it should be used
 * inside of a sticky-container as a contextual component.
 */
export default Ember.Component.extend({
  classNames: ['StickyItem-wrapper'],
  classNameBindings: ['activeClassName'],
  attributeBindings: ['style'],

  originalTopOffset: null,
  originalHeight: null,

  stickyBuffer: 0,

  topPosition: null,
  isSticky: false,
  isHidden: false,
  useAbsolutePositioning: false,

  activeClass: '',
  inactiveClass: '',

  toggleCaption: function() {},

  activeClassName: computed('isSticky', 'activeClass', function() {
    return get(this, 'isSticky') ? get(this, 'activeClass') : get(this, 'inactiveClass');
  }),

  style: computed('originalHeight', function() {
    // The parent wrapper must maintain the height of the StickyItem
    // to prevent the elements in the DOM from jumping around
    return Ember.String.htmlSafe(`height:${get(this, 'originalHeight')}px`);
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

    return Ember.String.htmlSafe(style);
  }),

  getOffsetTop() {
    return this.$().offset().top;
  },

  didInsertElement() {
    this._super(...arguments);

    // Save the initial position and height of the element
    const $this = this.$();

    setProperties(this, {
      originalTopOffset: $this.offset().top,
      originalHeight: $this.outerHeight()
    });
  },

  willDestroyElement() {
    // Remove the element from its container
    const removeItem = get(this, 'removeItem');
    if (removeItem) {
      removeItem(this);
    }
  },

  init() {
    this._super(...arguments);

    // Register the element with its container
    const registerItem = get(this, 'registerItem');
    if (registerItem) {
      registerItem(this);
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
