import Ember from 'ember';

const {
  get,
  set
} = Ember;

export default Ember.Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  actions: {
    save(callback) {
      set(this, 'isSaving', true);
      const post = get(this, 'model');
      const promise = post.save();

      callback(promise);

      promise.then(() => {
        this.sendAction('afterPublish', post);
      });
    }
  }
});
