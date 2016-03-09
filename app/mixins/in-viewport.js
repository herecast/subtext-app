import Ember from 'ember';

const {
  computed,
  get,
  set,
  run
} = Ember;

export default Ember.Mixin.create({
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

  exitedViewport: computed.not('enteredViewport'),

  _updateBoundingClientRect: function() {
    var el;
    el = this.$()[0];
    set(this, 'boundingClientRect', el.getBoundingClientRect());
  },

  _setup: (function() {
    return run.scheduleOnce('afterRender', this, function() {
      this._updateBoundingClientRect();
      set(this, 'windowHeight', window.innerHeight || document.documentElement.clientHeight);
      set(this, 'windowWidth', window.innerWidth || document.documentElement.clientWidth);
    });
  }).on('didInsertElement'),

  _scrollHandler: function() {
    return run.debounce(this, '_updateBoundingClientRect', get(this, 'scrollTimeout'));
  },

  _bindScroll: (function() {
    var scrollHandler;
    scrollHandler = this._scrollHandler.bind(this);
    Ember.$(document).on('touchmove.scrollable', scrollHandler);
    Ember.$(window).on('scroll.scrollable', scrollHandler);
  }).on('didInsertElement'),

  _unbindScroll: (function() {
    Ember.$(window).off('.scrollable');
    Ember.$(document).off('.scrollable');
  }).on('willDestroyElement')

});
