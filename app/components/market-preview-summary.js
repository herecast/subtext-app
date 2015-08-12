import Ember from 'ember';

export default Ember.Component.extend({
  isSaving: false,

  editLink: function() {
    if (this.get('model.isNew')) {
      return 'market.new.promotion';
    } else {
      return 'market.edit.promotion';
    }
  }.property('model.isNew'),

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const post = this.get('model');
      const promise = post.save();

      callback(promise);

      promise.then((savedPost) => {
        if (savedPost.get('image')) {
          savedPost.uploadImage().then(() => {
            this.set('isSaving', false);
            this.sendAction('afterPublish', savedPost);
          });
        } else {
          this.set('isSaving', false);
          this.sendAction('afterPublish', savedPost);
        }
      });
    }
  }
});
