import Ember from 'ember';

export default Ember.Component.extend({
  isSaving: false,

  editLink: function() {
    if (this.get('model.isNew')) {
      return 'events.new.promotion';
    } else {
      return 'events.edit.promotion';
    }
  }.property('model.isNew'),

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const event = this.get('model');
      const promise = event.save();

      callback(promise);

      promise.then((savedEvent) => {
        this.set('isSaving', false);
        savedEvent.uploadImage();
        this.sendAction('afterPublish', savedEvent);
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
