import Ember from 'ember';
import {throttle, debounce} from 'lodash';

const { get, set, computed, inject, $, isPresent, run } = Ember;

/**
 * Contextual component for rendering a list of "sticky" items.
 * Namely, these are headers that stick to a given position until it is replaced by the next one as the user scrolls.
 * Each sticky item will "stick" to the location of the named sticky-position, which is optional.
 */
export default Ember.Component.extend({
  _items: Ember.A(),
  _currentStickyItem: null,

  // the name of the sticky-position element elsewhere on the page marking where the items should stick
  position: null,
  defaultPosition: 0,
  enabled: true,

  scrollTarget: window,
  refreshOffsetDuringScroll: false,

  stickyService: inject.service('sticky'),
  fastboot: inject.service(),

  keyForOnTouchMoveHook: computed('elementId', function() {
    const elementId = get(this, 'elementId');
    return `touchmove.stickies-${elementId}`;
  }),

  keyForOnTouchEndHook: computed('elementId', function() {
    const elementId = get(this, 'elementId');
    return `touchend.stickies-${elementId}`;
  }),

  keyForScrollHook: computed('elementId', function() {
    const elementId = get(this, 'elementId');
    return `scroll.stickies-${elementId}`;
  }),

  keyForResizeHook: computed('elementId', function() {
    const elementId = get(this, 'elementId');
    return `resize.stickies-${elementId}`;
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
    const scrollTarget = get(this, 'scrollTarget');
    const refreshOffset = scrollTarget !== window && get(this, 'refreshOffsetDuringScroll');

    let absoluteStickyPosition = stickyPosition;

    if (refreshOffset) {
      absoluteStickyPosition += $(scrollTarget).offset().top;
    } else {
      absoluteStickyPosition += $(scrollTarget).scrollTop();
    }

    // Get the last item that we've scrolled past.
    return get(this, 'sortedItemsReverse').find(function(item) {
      let itemOffset = refreshOffset ? item.getOffsetTop() : get(item, 'originalTopOffset');
      itemOffset += get(item, 'stickyBuffer');

      return itemOffset <= absoluteStickyPosition;
    });
  },

  _updateStickyPositions() {
    if (get(this, 'isDestroying') || ! get(this, 'enabled')) {
      return;
    }

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
      this.clearActiveStickyItem();
    }
  },

  clearActiveStickyItem() {
    const currentStickyItem = get(this, '_currentStickyItem');
    if (currentStickyItem) {
      currentStickyItem.resetPositioning();
      set(this, '_currentStickyItem', null);
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'enabled')) {
      this.clearActiveStickyItem();
    }
  },

  didInsertElement() {
    this._super(...arguments);

    if (get(this, 'enabled')) {

      set(this, 'defaultPosition', this.$().position().top);

      const $scrollTarget = $(get(this, 'scrollTarget'));

      // Note: throttling/debounce is necessary since we are polling the sticky position each time
      // Debounce ensures UI is correct after the last scroll action
      // Using lodash's throttle & debounce instead of Ember's because it works better w/ jQuery
      const throttledUpdate = throttle(() => this._updateStickyPositions(), 50);
      const debouncedUpdate = debounce(() => this._updateStickyPositions(), 50);

      // Update sticky positions when the user moves the page on mobile
      $scrollTarget.on(get(this, 'keyForOnTouchMoveHook'), throttledUpdate);

      // Final update after user has finished moving the page on mobile
      // No need to debounce, this is fired only once per user interaction
      $scrollTarget.on(get(this, 'keyForOnTouchEndHook'), () => this._updateStickyPositions());

      // Update sticky positions when the user scrolls
      $scrollTarget.on(get(this, 'keyForScrollHook'), () => {
        throttledUpdate();
        debouncedUpdate();
      });

      // Update sticky positions when the user resizes the window
      $(window).on(get(this, 'keyForResizeHook'), debouncedUpdate);

      // Update the sticky positions at least once after the page has loaded
      // This is useful for cases where the user is already scrolled down the page
      run.later(this, this._updateStickyPositions, 50);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    const $scrollTarget = $(get(this, 'scrollTarget'));

    $scrollTarget.off(get(this, 'keyForOnTouchMoveHook'));
    $scrollTarget.off(get(this, 'keyForScrollHook'));
    $(window).off(get(this, 'keyForResizeHook'));
  },

  actions: {
    registerItem(item) {
      if (! get(this, 'fastboot.isFastBoot')) {
        get(this, '_items').pushObject(item);
      }
    },
    removeItem(item) {
      if (!get(this, 'isDestroying')) {
        get(this, '_items').removeObject(item);
        if (get(this, '_currentStickyItem') === item) {
          set(this, '_currentStickyItem', null);
        }
      }
    }
  }
});
