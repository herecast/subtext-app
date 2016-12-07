import Ember from 'ember';

const { get, computed, $, inject } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-modal'],
  classNames: ['Modal'],

  modalService: inject.service('modals'),

  fullscreen: false,

  isFullScreen: computed('fullscreen', 'media.isMobile', function() {
    if (get(this, 'fullscreen')) {
      return this.media.isMobile || get(this, 'fullscreen');
    }

    return false;
  }),

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
      this.$().scrollTop(offset);
    }
  }

});
