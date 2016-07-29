import Ember from 'ember';

const { run, set, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['Modal'],
  visible: false,
  fullscreen: false,
  showHeader: computed('title', 'close', function() {
    return (this.attrs.title || this.attrs.close);
  }),

  didInsertElement() {
    // For toggling css transitions
    run.next(()=>{
      set(this, 'visible', true);
    });
  }
});
