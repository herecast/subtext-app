import Ember from 'ember';

export default Ember.Component.extend({
  editLink: function() {
    if (this.get('model.isNew')) {
      return 'events.new.promotion';
    } else {
      return 'events.edit.promotion';
    }
  }.property('model.isNew'),

  actions: {
    save() {
      const event = this.get('model');

      event.save().then((savedEvent) => {
        savedEvent.uploadImage();
        this.sendAction('afterPublish');
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
