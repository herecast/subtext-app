import Ember from 'ember';

const {
  set,
  computed
} = Ember;

export default Ember.Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  editLink: computed('model.isNew', function() {
    if (this.get('model.isNew')) {
      return 'market.new.promotion';
    } else {
      return 'market.edit.promotion';
    }
  }),

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const post = this.get('model');
      const promise = post.save();

      callback(promise);

      promise.then(() => {
        this.sendAction('afterPublish', post);
      }).finally(()=>{
        set(this, 'isSaving', false);
      });
    }
  }
});
