import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  initAttachFile: function() {
    this.$('input[type=file]').on('change', (e) => {
      const file = this.$(e.target).context.files[0];

      this.set('event.image', file);
    });
  }.on('didInsertElement'),

  removeChangeEvent: function() {
    this.$('input[type=file]').off('change');
  }.on('willDestroyElement'),

  actions: {
    save() {
      const event = this.get('event');

      event.save().then((savedEvent) => {
        savedEvent.uploadImage();
        this.sendAction('afterSave');
      });
    },

    discard() {
      if (confirm('Are you sure you want to discard this event?')) {
        const event = this.get('event');
        event.destroyRecord();
        this.sendAction('afterDiscard');
      }
    }
  }
});
