import Ember from 'ember';

const { get, computed, $, inject } = Ember;

export default Ember.Component.extend({

  attributeBindings: ['data-test-modal'],
  classNames: ['Modal'],

  modalService: inject.service('modals'),

  fullscreen: false,

  showHeader: computed('title', 'close', function() {
    return (this.attrs.title || this.attrs.close);
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
