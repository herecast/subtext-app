import Ember from 'ember';

export default Ember.Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const event = this.get('model');
      const promise = event.save();

      callback(promise);

      promise.then((savedEvent) => {
        this.sendAction('afterPublish', savedEvent);
      });
    }
  }
});
