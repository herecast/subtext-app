import { inject as service } from '@ember/service';
import { next, later } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { computed, set, get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import $ from 'jquery';
import { isPresent, isBlank } from '@ember/utils';
import { throttle, debounce } from 'lodash';
import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['data-test-modal'],
  classNames: ['Modal'],
  classNameBindings: [
    'willAnimateAway:Modal--willAnimateAway',
    'modal-class',
    'isSlider:is-slider',
    'revealNav:reveal-nav',
    'isMobile:is-mobile'
  ],

  modalService: service('modals'),
  fastboot: service(),
  tracking: service(),
  media: service(),
  isMobile: readOnly('media.isMobile'),

  fullscreen: false,
  isSmall: false,

  willAnimateAway: false,
  animateAway: false,
  preserveModal: false,

  windowHeight: 1000,
  isScrollingBody: false,
  isBodyAtBottom: false,
  maintainBodyClass: false,
  hasInternalModals: false,
  closeOnClickOutside: true,
  revealNav: false,
  isDetailPage: false,

  slideInFrom: null,
  slideOutTo: null,
  slideMessage: null,
  isSlider: computed('slideInFrom', 'slideOutTo', function() {
    return isPresent(get(this, 'slideInFrom')) && isPresent(get(this, 'slideOutTo'));
  }),
  showOnScreen: false,
  sliderClass: computed('slideInFrom', 'slideOutTo', 'showOnScreen', function() {
    if (get(this, 'isSlider')) {
      const slideInFrom = get(this, 'slideInFrom');
      const slideOutTo = get(this, 'slideOutTo');

      if (get(this, 'showOnScreen')) {
        return `end-slide-from-${slideOutTo}`;
      } else {
        return `start-slide-from-${slideInFrom}`;
      }
    }

    return null;
  }),

  showCloseOutsideModal: computed('isSlider', 'isMobile', function() {
    return get(this, 'isSlider') && !get(this, 'isMobile');
  }),

  showSlideCloseButton: computed('isSlider', 'isMobile', function() {
    return get(this, 'isSlider') && get(this, 'isMobile');
  }),

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

  totalScrollDistance: computed('windowHeight', function() {
    return get(this, 'windowHeight') * 0.25;
  }),

  modalDialogStyle: computed('windowHeight', 'media.isMobile', function() {
    const style = get(this, 'media.isMobile') ? `max-height: ${get(this, 'windowHeight')*0.96}px` : '';
    return htmlSafe(style);
  }),

  modalBodyStyle: computed('windowHeight', 'media.isMobile', 'willAnimateAway', function() {
    let style = '';

    if (get(this, 'media.isMobile') && get(this, 'willAnimateAway')) {
      style = `max-height: ${get(this, 'windowHeight') * 0.96}px`;
    }

    return htmlSafe(style);
  }),

  modalInnerStyle: computed('totalScrollDistance', 'willAnimateAway', 'isScrollingBody', 'isBodyAtBottom',  function() {
    let style = '';

    if (get(this, 'isScrollingBody') || ! get(this, 'isBodyAtBottom')) {
      style = 'margin-bottom: 0; overflow: hidden';
    } else if (get(this, 'willAnimateAway')) {
      style = `margin-bottom: ${get(this, 'totalScrollDistance') + 100}px`;
    }

    return htmlSafe(style);
  }),

  click(e) {
    if (get(this, 'closeOnClickOutside')) {
      const close = get(this, 'close');
      const $target = $(e.target);
      if (close && ($target.hasClass('Modal-inner') || $target.hasClass('Modal'))) {
        get(this, 'tracking').trackCloseModalClickOutside();
        close();
      }
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
      const scrollTop = $(this.element).scrollTop();
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
      $(this.element).css({opacity});
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
    $(this.element)
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
      this._determineIfBodyAtBottom();
    }
  },

  /**
   * Determine if the modal dialog body is scrolled to the bottom,
   * so we can determine if we should allow the overlay to scroll,
   * so the user can swipe the modal away if `willAnimateAway` is true.
   *
   * @see https://stackoverflow.com/questions/876115/how-can-i-determine-if-a-div-is-scrolled-to-the-bottom#876134
   * @private
   */
  _determineIfBodyAtBottom() {
    const $modalBody = $(this.element).find('.Modal-dialog-body');
    const scrollHeight = $modalBody.get(0).scrollHeight;
    const scrollTop = $modalBody.scrollTop();
    const height = $modalBody.outerHeight();

    const diff = scrollHeight - height - scrollTop;
    set(this, 'isBodyAtBottom', diff < 1);
  },

  didInsertElement() {
    this._super(...arguments);

    get(this, 'modalService').addModalBodyClass();

    // Set the visible height of the window so we can set relative heights accordingly
    // Addresses this problem: https://nicolas-hoizey.com/2015/02/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers.html
    this._recordWindowHeight();
    $(window).on(get(this, 'keyForResizeEvent'), debounce(() => this._recordWindowHeight(), 50));

    // Determine if we are at the bottom of the dialog already
    this._determineIfBodyAtBottom();

    // Init sets up slider offscreen, has to be rendered in DOM before can slide in
    if (get(this, 'isSlider')) {
      next(() => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'showOnScreen', true);
        }
      });

      if (get(this, 'atSlideStart')) {
        get(this, 'atSlideStart')();
      }
    }

    if (get(this, 'willAnimateAway')) {
      const $this = $(this.element);

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
          this._determineIfBodyAtBottom();
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
    const $this = $(this.element);
    $this.off(get(this, 'keyForScrollEvent'));
    $this.off(get(this, 'keyForScrollEndEvent'));
    $this.off(get(this, 'keyForTouchMoveEvent'));
    $this.off(get(this, 'keyForTouchEndEvent'));
    $this.find('.Modal-dialog-body').off(get(this, 'keyForScrollingBodyEvent'));
    $(window).off(get(this, 'keyForResizeEvent'));
  },

  willDestroyElement() {
    this._super(...arguments);

    if (!get(this, 'maintainBodyClass')) {
      get(this, 'modalService').removeModalBodyClass();
    }

    this._removeEventListeners();
  },

  performAnimateAway() {
    get(this, 'tracking').trackCloseModalSlideAway();
    this._removeEventListeners();

    $(this.element).find('.Modal-dialog').css({
      animation: 'slide-up 0.5s',
      marginBottom: '100vh',
      marginTop: '-100vh'
    });

    this.close();
  },

  actions: {
    scrollTo(offset) {
      const $el = $(this.element);
      if ($el && $el.length) {
        $(this.element).find('.Modal-dialog-body').scrollTop(offset);
        this._determineIfBodyAtBottom();
      }
    },

    clickModalClose() {
      get(this, 'tracking').trackCloseModalClickButton();
      this.send('closeModal');
    },

    closeModal() {
      if (get(this, 'isSlider')) {
        set(this, 'showOnScreen', false);

        if (this.close) {
          later(() => {
            this.close();
          }, 550);
        }
      } else {
        if (this.close) {
          this.close();
        }
      }

    }
  }

});
