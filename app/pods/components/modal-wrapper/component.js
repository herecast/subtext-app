import Ember from 'ember';

const { get, computed, $, inject, isBlank } = Ember;

export default Ember.Component.extend({

  attributeBindings: ['data-test-modal'],
  classNames: ['Modal'],

  modalService: inject.service('modals'),
  fastboot: inject.service(),

  fullscreen: false,

  showHeader: computed('title', 'close', function() {
    return (this.attrs.title || this.attrs.close);
  }),

  isAnimated: computed('fastboot.isFastboot', function () {
    const isFastboot = get(this, 'fastboot.isFastboot');
    const shoebox = get(this, 'fastboot.shoebox');
    const shoeboxKey = 'disableModalAnimation';

    if (isFastboot) {
      shoebox.put(shoeboxKey, true);
      return true;
    } else {
      // Note: `shoebox.retrieve` pops the key from the map, so future calls will return undefined.
      // Thus this is safe for showing the animation on subsequent modals
      const disableModalAnimation = shoebox.retrieve(shoeboxKey);
      return isBlank(disableModalAnimation);
    }
  }),

  click(e) {
    // Clicking on overlay should close the modal
    if ($(e.target).hasClass('Modal') && this.attrs.close) {
      this.close();
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
