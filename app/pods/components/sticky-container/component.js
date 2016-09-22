import Ember from 'ember';

const { get, set, computed, inject, $, isPresent, run } = Ember;

/**
 * Contextual component for rendering a list of "sticky" items.
 * Namely, these are headers that stick to a given position until it is replaced by the next one as the user scrolls.
 * Each sticky item will "stick" to the location of the named sticky-position, which is required.
 */
export default Ember.Component.extend({
  _items: Ember.A(),
  _currentStickyItem: null,

  // the name of the sticky-position element elsewhere on the page marking where the items should stick
  position: null,
  defaultPosition: 0,
  touchMoving: false,

  scrollTarget: window,

  stickyService: inject.service('sticky'),

  keyForOnMoveStartHook: computed('position', function() {
    const position = get(this, 'position');
    return `touchstart.stickies-${position}`;
  }),

  keyForOnMoveEndHook: computed('position', function() {
    const position = get(this, 'position');
    return `touchend.stickies-${position}`;
  }),

  keyForScrollHook: computed('position', function() {
    const position = get(this, 'position');
    return `scroll.stickies-${position}`;
  }),

  keyForResizeHook: computed('position', function() {
    const position = get(this, 'position');
    return `resize.stickies-${position}`;
  }),

  sortedItems: computed('_items.@each.originalTopOffset', function() {
    return get(this, '_items').sortBy('originalTopOffset');
  }),

  sortedItemsReverse: computed('sortedItems.[]', function() {
    // taking advantage of ember's computed property caching to make this more efficient
    return get(this, 'sortedItems').reverse();
  }),

  getStickyPosition() {
    const position = get(this, 'position');
    const stickyService = get(this, 'stickyService');
    const stickyPosition = stickyService.getPosition(position);

    // Get the requested position, or default to the top of this container
    return (isPresent(stickyPosition)) ? stickyPosition : get(this, 'defaultPosition');
  },

  _findNextStickyItem(stickyPosition) {
    let absoluteStickyPosition = $(get(this, 'scrollTarget')).scrollTop() + stickyPosition + 5;

    // Get the last item that we've scrolled past.
    return get(this, 'sortedItemsReverse').find(function(item) {
      return get(item, 'originalTopOffset') <= absoluteStickyPosition;
    });
  },

  _updateStickyPositions() {
    const stickyPosition = this.getStickyPosition();
    const nextStickyItem = this._findNextStickyItem(stickyPosition);
    const currentStickyItem = get(this, '_currentStickyItem');

    if (nextStickyItem) {

      // Reset previous sticky item
      if (currentStickyItem && currentStickyItem !== nextStickyItem) {
        currentStickyItem.resetPositioning();
      }

      // Make this item sticky and set it as the current item
      nextStickyItem.stickItem(stickyPosition);
      set(this, '_currentStickyItem', nextStickyItem);

    } else {
      // Nothing should be sticky
      if (currentStickyItem) {
        currentStickyItem.resetPositioning();
        set(this, '_currentStickyItem', null);
      }
    }
  },

  didInsertElement() {
    this._super(...arguments);
    set(this, 'defaultPosition', this.$().position().top);

    const $scrollTarget = $(get(this, 'scrollTarget'));

    // Use move start and end to detect beginning and end of touch scrolling
    // Have to disable scroll call (see below) in order for start/end pair to work
    $scrollTarget.on(get(this, 'keyForOnMoveStartHook'), () => {
      const currentStickyItem = get(this, '_currentStickyItem');
      if (currentStickyItem) {
        set(this, 'touchMoving', true);
        currentStickyItem.hide();
      }
    });

    $scrollTarget.on(get(this, 'keyForOnMoveEndHook'), () => {
      set(this, 'touchMoving', false);
      run.throttle(this, this._updateStickyPositions, 50, true);
      run.debounce(this, this._updateStickyPositions, 100);
    });

    // Update sticky positions when the user scrolls
    $scrollTarget.on(get(this, 'keyForScrollHook'), () => {
      // Note: throttling/debounce is necessary since we are polling the sticky position each time
      // Run immediately and throttle calls spaced 50 ms
      // Debounce ensures UI is correct after the last scroll action
      // Must check if touchMoving or not, as both will fire in parallel
      if (!get(this, 'touchMoving')){
        run.throttle(this, this._updateStickyPositions, 50, true);
        run.debounce(this, this._updateStickyPositions, 100);
      }
    });

    // Update sticky positions when the user resizes the window
    $(window).on(get(this, 'keyForResizeHook'), () => {
      run.debounce(this, this._updateStickyPositions, 50);
    });

    // Update the sticky positions at least once after the page has loaded
    // This is useful for cases where the user is already scrolled down the page
    run.later(this, this._updateStickyPositions, 50);
  },

  willDestroyElement() {
    this._super(...arguments);
    const $scrollTarget = $(get(this, 'scrollTarget'));

    $scrollTarget.off(get(this, 'keyForOnMoveHook'));
    $scrollTarget.off(get(this, 'keyForScrollHook'));
    $(window).off(get(this, 'keyForResizeHook'));
  },

  actions: {
    registerItem(item) {
      get(this, '_items').pushObject(item);
    },
    removeItem(item) {
      get(this, '_items').removeObject(item);
      if (get(this, '_currentStickyItem') === item) {
        set(this, '_currentStickyItem', null);
      }
    }
  }
});
