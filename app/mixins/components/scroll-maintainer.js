import Ember from 'ember';

export default Ember.Mixin.create({
  scrollingTimeout: 100,

  bindScrolling: Ember.on('didInsertElement', function() {
    const onScroll = () => {
      Ember.run.debounce(this, this.runScrolled, this.scrollingTimeout);
    };

    Ember.$(document).on('touchmove.scrollable', onScroll);
    Ember.$(window).on('scroll.scrollable', onScroll);
  }),

  unbindScrolling: Ember.on('willDestroyElement', function() {
    Ember.$(window).off('.scrollable');
    Ember.$(document).off('.scrollable');
  }),

  preservePos: Ember.on('didInsertElement', function() {
    const position = this.getWithDefault('controller.scrollPosition', 0);
    Ember.$(window).scrollTop(position);
  }),

  runScrolled() {
    this.set('controller.scrollPosition', Ember.$(window).scrollTop());
  }
});
