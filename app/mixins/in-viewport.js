import { not } from '@ember/object/computed';
import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { set, get, computed } from '@ember/object';
import { run } from '@ember/runloop';

export default Mixin.create({
  scrollTimeout:      100,
  boundingClientRect: 0,
  windowHeight:       0,
  windowWidth:        0,

  enteredViewport: computed('boundingClientRect', 'windowHeight', 'windowWidth', function() {
    var rect, windowHeight, windowWidth;
    rect =         get(this, 'boundingClientRect');
    windowHeight = get(this, 'windowHeight');
    windowWidth =  get(this, 'windowWidth');
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );
  }),

  exitedViewport: not('enteredViewport'),

  _updateBoundingClientRect() {
    var el;
    el = $(this.element)[0];
    set(this, 'boundingClientRect', el.getBoundingClientRect());
  },

  _scrollHandler() {
    return run.debounce(this, '_updateBoundingClientRect', get(this, 'scrollTimeout'));
  },

  didInsertElement() {
    this._super(...arguments);

    var scrollHandler;
    scrollHandler = this._scrollHandler.bind(this);
    $(document).on('touchmove.scrollable', scrollHandler);
    $(window).on('scroll.scrollable', scrollHandler);

    run.scheduleOnce('afterRender', this, function() {
      this._updateBoundingClientRect();
      set(this, 'windowHeight', window.innerHeight || document.documentElement.clientHeight);
      set(this, 'windowWidth', window.innerWidth || document.documentElement.clientWidth);
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    $(window).off('.scrollable');
    $(document).off('.scrollable');
  }
});
