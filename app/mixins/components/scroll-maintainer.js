import Ember from 'ember';

export default Ember.Mixin.create({
  scrollMaintainer: Ember.inject.service('scroll-maintainer'),

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
    const position = this.getWithDefault('scrollMaintainer.position', 0);
    Ember.$(window).scrollTop(position);
  }),

  runScrolled() {
    this.set('scrollMaintainer.position', Ember.$(window).scrollTop());
  }
});
