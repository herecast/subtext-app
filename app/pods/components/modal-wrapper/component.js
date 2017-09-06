import Ember from 'ember';
import {throttle, debounce} from 'lodash';

const {get, set, computed, $, inject, isBlank, isPresent} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-modal'],
  classNames: ['Modal'],
  classNameBindings: ['willAnimateAway:Modal--willAnimateAway'],

  modalService: inject.service('modals'),
  fastboot: inject.service(),
  tracking: inject.service(),

  fullscreen: false,
  isSmall: false,

  willAnimateAway: false,
  animateAway: false,

  showHeader: computed('title', function() {
    return isPresent(get(this, 'title'));
  }),

  isAnimated: computed('fastboot.isFastBoot', function() {
    const isFastboot = get(this, 'fastboot.isFastBoot');
    const shoebox = get(this, 'fastboot.shoebox');
    const shoeboxKey = 'disableModalAnimation';

    if (isFastboot) {
      shoebox.put(shoeboxKey, true);
      return false;
    } else {
      // Note: `shoebox.retrieve` pops the key from the map, so future calls will return undefined.
      // Thus this is safe for showing the animation on subsequent modals
      const disableModalAnimation = shoebox.retrieve(shoeboxKey);
      return isBlank(disableModalAnimation);
    }
  }),

  keyForScrollEvent: computed('elementId', function() {
    return `scroll.modal-${get(this, 'elementId')}`;
  }),

  keyForScrollEndEvent: computed('elementId', function() {
    return `scroll.modal-${get(this, 'elementId')}-end`;
  }),

  keyForTouchMoveEvent: computed('elementId', function() {
    return `touchmove.modal-${get(this, 'elementId')}`;
  }),

  keyForTouchEndEvent: computed('elementId', function() {
    return `touchend.modal-${get(this, 'elementId')}`;
  }),

  keyForResizeEvent: computed('elementId', function() {
    return `resize.modal-${get(this, 'elementId')}`;
  }),

  keyForScrollingBodyEvent: computed('elementId', function() {
    return `scroll.modal-body-${get(this, 'elementId')}`;
  }),

  windowHeight: 1000,
  isScrollingBody: false,

  totalScrollDistance: computed('windowHeight', 'media.isMobile', function() {
    if (get(this, 'media.isMobile')) {
      return get(this, 'windowHeight') * 0.25;
    } else {
      return get(this, 'windowHeight') * 0.35;
    }
  }),

  modalDialogStyle: computed('windowHeight', 'media.isMobile', function() {
    const style = get(this, 'media.isMobile') ? `max-height: ${get(this, 'windowHeight')*0.90}px` : '';
    return Ember.String.htmlSafe(style);
  }),

  modalBodyStyle: computed('windowHeight', 'media.isMobile', 'willAnimateAway', function() {
    let style = '';

    if (get(this, 'media.isMobile') && get(this, 'willAnimateAway')) {
      style = `max-height: ${get(this, 'windowHeight') * 0.85}px`;
    }

    return Ember.String.htmlSafe(style);
  }),

  modalInnerStyle: computed('totalScrollDistance', 'willAnimateAway', 'isScrollingBody',  function() {
    let style = '';

    if (get(this, 'isScrollingBody')) {
      style = 'margin-bottom: 0';
    } else if (get(this, 'willAnimateAway')) {
      style = `margin-bottom: ${get(this, 'totalScrollDistance') + 100}px`;
    }

    return Ember.String.htmlSafe(style);
  }),

  click(e) {
    // Clicking on overlay should close the modal
    const close = get(this, 'close');
    const $target = $(e.target);
    if (close && ($target.hasClass('Modal-inner') || $target.hasClass('Modal'))) {
      get(this, 'tracking').trackCloseModalClickOutside();
      close();
    }
  },

  /**
   * Calculate the opacity for modal based on its scroll position
   *
   * @returns {number}
   * @private
   */
  _calculateModalOpacity() {
    if (!get(this, 'isDestroyed')) {
      const totalScrollDistance = get(this, 'totalScrollDistance');
      const scrollTop = this.$().scrollTop();
      return 1 - (scrollTop / (totalScrollDistance));
    } else {
      return 1;
    }
  },

  /**
   * Update the opacity of the modal based on the modal's scroll position.
   * This enables us to fade the modal in/out as the user is scrolling/pushing it away.
   * @private
   */
  _updateModalOpacity() {
    if (!get(this, 'isDestroyed') && !(get(this, 'isScrollingBody'))) {
      const opacity = this._calculateModalOpacity();
      this.$().css({opacity});
    }
  },

  /**
   * When user is finished scrolling or moving the dialog, we determine based on the modal's opacity
   * if we should either perform an animated close or "snap back" the modal to its starting position.
   * @private
   */
  _handleScrollEndEvent() {
    if (!get(this, 'isDestroyed') && !(get(this, 'isScrollingBody'))) {
      const opacity = this._calculateModalOpacity();
      if (opacity < 0.2) {
        this.performAnimateAway();
      } else {
        this._snapBack();
      }
    }
  },

  _snapBack() {
    this.$()
      .scrollTop(0)
      .css({opacity: 1});
  },

  /**
   * Set the visible height of the window so we can set relative heights accordingly
   *
   * @see https://nicolas-hoizey.com/2015/02/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers.html
   * @private
   */
  _recordWindowHeight() {
    if (!get(this, 'isDestroyed')) {
      set(this, 'windowHeight', Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    }
  },

  didInsertElement() {
    this._super(...arguments);

    // Set the visible height of the window so we can set relative heights accordingly
    // Addresses this problem: https://nicolas-hoizey.com/2015/02/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers.html
    this._recordWindowHeight();
    Ember.$(window).on(get(this, 'keyForResizeEvent'), debounce(() => this._recordWindowHeight(), 50));

    if (get(this, 'willAnimateAway')) {
      const $this = this.$();

      // Handle scrolling and touchmove events
      // throttle updates to modal opacity as user scrolls
      // Using lodash's throttle method instead of Ember.run.throttle because it works better with jquery
      const throttledScroll = throttle(() => this._updateModalOpacity(), 50);
      $this.on(get(this, 'keyForScrollEvent'), throttledScroll);
      $this.on(get(this, 'keyForTouchMoveEvent'), throttledScroll);

      // Handle end of scrolling / touchend events
      // determine if we should animate the modal away or make it "snap back" to its starting position
      // Using lodash's debounce method instead of Ember.run.debounce because it works better with jquery
      const debouncedScrollEnd = debounce(() => this._handleScrollEndEvent(), 500);
      $this.on(get(this, 'keyForScrollEndEvent'), debouncedScrollEnd);

      // No need to debounce touchend event as it only happens once per interaction
      // In fact, debouncing that event was creating a noticeable lag on mobile
      $this.on(get(this, 'keyForTouchEndEvent'), () => this._handleScrollEndEvent());

      const debouncedScrollingBody = debounce(() => {
        if (!get(this, 'isDestroyed') && get(this, 'isScrollingBody')) {
          set(this, 'isScrollingBody', false);
          $this.css({opacity: 1});
        }
      }, 750);

      $this.find('.Modal-dialog-body').on(get(this, 'keyForScrollingBodyEvent'), throttle(() => {
        $this.find('.Modal-inner').css({marginBottom: 0});
        set(this, 'isScrollingBody', true);
        debouncedScrollingBody();
      }, 200));
    }
  },

  _removeEventListeners() {
    const $this = this.$();
    $this.off(get(this, 'keyForScrollEvent'));
    $this.off(get(this, 'keyForScrollEndEvent'));
    $this.off(get(this, 'keyForTouchMoveEvent'));
    $this.off(get(this, 'keyForTouchEndEvent'));
    $this.find('.Modal-dialog-body').off(get(this, 'keyForScrollingBodyEvent'));
    Ember.$(window).off(get(this, 'keyForResizeEvent'));
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, 'modalService').removeModalBodyClass();
    $('body').removeClass('modal-open');

    this._removeEventListeners();
  },

  performAnimateAway() {
    get(this, 'tracking').trackCloseModalSlideAway();
    this._removeEventListeners();

    this.$().find('.Modal-dialog').css({
      animation: 'slide-up 0.5s',
      marginBottom: '100vh',
      marginTop: '-100vh',
      opacity: 0
    });

    this.close();
  },

  actions: {
    scrollTo(offset) {
      const $el = this.$();
      if ($el && $el.length) {
        this.$().find('.Modal-dialog-body').scrollTop(offset);
      }
    },
    closeModal() {
      get(this, 'tracking').trackCloseModalClickButton();
      this.close();
    }
  }

});
