import Ember from 'ember';

const { get, set, setProperties, computed } = Ember;

/**
 * This component should not be used directly. Rather, it should be used
 * inside of a sticky-container as a contextual component.
 */
export default Ember.Component.extend({
  classNames: ['StickyItem-wrapper'],
  attributeBindings: ['style'],

  originalTopOffset: null,
  originalHeight: null,

  topPosition: null,
  isSticky: false,
  isHidden: false,

  style: computed('originalHeight', function() {
    // The parent wrapper must maintain the height of the StickyItem
    // to prevent the elements in the DOM from jumping around
    return Ember.String.htmlSafe(`height:${get(this, 'originalHeight')}px`);
  }),

  stickyItemStyle: computed('topPosition', 'isHidden', function() {
    const topPosition = get(this, 'topPosition');
    let style = '';

    if (topPosition !== null) {
      style += `top:${get(this, 'topPosition')}px;`;
    }

    if (get(this, 'isHidden')) {
      style += 'display: none;';
    }

    return Ember.String.htmlSafe(style);
  }),

  didInsertElement() {
    this._super(...arguments);

    // Save the initial position and height of the element
    //Ember.run.next(this, function() {
      const $this = this.$();

      setProperties(this, {
        originalTopOffset: $this.offset().top,
        originalHeight: $this.outerHeight()
      });
    //});
  },

  willDestroyElement() {
    // Remove the element from its container
    if ('removeItem' in this.attrs) {
      this.attrs.removeItem(this);
    }
  },

  init() {
    this._super(...arguments);

    // Register the element with its container
    if ('registerItem' in this.attrs) {
      this.attrs.registerItem(this);
    }
  },

  stickItem(topPosition) {
    setProperties(this, {
      topPosition,
      isSticky: true,
      isHidden: false
    });
  },

  resetPositioning() {
    setProperties(this, {
      topPosition: null,
      isSticky: false,
      isHidden: false
    });
  },

  hide() {
    set(this, 'isHidden', true);
  }
});