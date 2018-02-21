import Ember from 'ember';

export default Ember.Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const talk = this.get('model');
      const promise = talk.save();

      callback(promise);

      promise.then(() => {
        this.sendAction('afterPublish', talk);
      });
    }
  }
});
