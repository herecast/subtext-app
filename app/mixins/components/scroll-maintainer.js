import $ from 'jquery';
import { debounce } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  scrollMaintainer: service('scroll-maintainer'),

  scrollingTimeout: 100,

  bindScrolling: on('didInsertElement', function() {
    const onScroll = () => {
      debounce(this, this.runScrolled, this.scrollingTimeout);
    };

    $(document).on('touchmove.scrollable', onScroll);
    $(window).on('scroll.scrollable', onScroll);
  }),

  unbindScrolling: on('willDestroyElement', function() {
    $(window).off('.scrollable');
    $(document).off('.scrollable');
  }),

  preservePos: on('didInsertElement', function() {
    const position = this.getWithDefault('scrollMaintainer.position', 0);
    $(window).scrollTop(position);
  }),

  runScrolled() {
    this.set('scrollMaintainer.position', $(window).scrollTop());
  }
});
