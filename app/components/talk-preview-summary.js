import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  editLink: computed('model.isNew', function() {
    if (this.get('model.isNew')) {
      return 'talk.new.promotion';
    } else {
      return 'talk.edit.promotion';
    }
  }),

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const talk = this.get('model');
      const promise = talk.save();

      callback(promise);

      promise.then((savedTalk) => {
        this.sendAction('afterPublish', savedTalk);
      }).finally(()=>{
        this.set('isSaving', false);
      });
    }
  }
});
