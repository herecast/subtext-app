import Ember from 'ember';

const { run, set, get, computed, $, inject } = Ember;

export default Ember.Component.extend({
  classNames: ['Modal'],

  modalService: inject.service('modals'),

  visible: false,
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

  didInsertElement() {
    // For toggling css transitions
    run.next(() => {
      get(this, 'modalService').addModalBodyClass();
      set(this, 'visible', true);
    });
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
