import Ember from 'ember';

const { get, computed, $, inject, isBlank } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-modal'],
  classNames: ['Modal'],

  modalService: inject.service('modals'),
  fastboot: inject.service(),

  fullscreen: false,
  isSmall: false,

  showHeader: computed('title', 'close', function() {
    return (get(this, 'title') || get(this, 'close'));
  }),

  isAnimated: computed('fastboot.isFastBoot', function () {
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

  click(e) {
    // Clicking on overlay should close the modal
    const close = get(this, 'close');
    const $target = $(e.target);
    if (close && ($target.hasClass('Modal-inner') || $target.hasClass('Modal'))) {
      close();
    }
  },

  willDestroyElement() {
    get(this, 'modalService').removeModalBodyClass();

    $('body').removeClass('modal-open');
  },

  actions: {
    scrollTo(offset) {
      const $el = this.$();
      if($el && $el.length) {
        this.$().scrollTop(offset);
      }
    }
  }

});
