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
        savedEvent.get('eventInstances').filterBy('isNew').forEach((instance) => {
          instance.destroyRecord();
        });

        if (savedEvent.get('image')) {
          savedEvent.uploadImage().then(() => {
            this.set('isSaving', false);
            this.sendAction('afterPublish', savedEvent);
          });
        } else {
          this.set('isSaving', false);
          this.sendAction('afterPublish', savedEvent);
        }
      });
    }
  }
});
