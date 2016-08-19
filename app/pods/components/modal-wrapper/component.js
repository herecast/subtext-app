import Ember from 'ember';

const { run, set, computed, $ } = Ember;

export default Ember.Component.extend({
  classNames: ['Modal'],
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
    run.next(()=>{
      set(this, 'visible', true);
    });
  },

  actions: {
    scrollTo(offset) {
      this.$().scrollTop(offset);
    }
  }

});
