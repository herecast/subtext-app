import Ember from 'ember';

const {
  get,
  RSVP,
  set
} = Ember;

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
      const images = get(post, 'images').filterBy('file');
      const promise = post.save();

      callback(promise);

      promise.then((savedPost) => {
        images.setEach('contentId', get(savedPost, 'id'));

        RSVP.all(
          images.map((image) => {
            return image.save();
          })
        ).then(() => {
          set(this, 'isSaving', false);
          this.sendAction('afterPublish', savedPost);
        });
      });
    }
  }
});
