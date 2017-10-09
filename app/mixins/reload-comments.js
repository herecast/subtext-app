import Ember from 'ember';

const { get } = Ember;

export default Ember.Mixin.create({
  actions: {
    reloadComments(newComment) {
      get(this, 'model').incrementProperty('commentCount');
      get(this, 'model.comments').insertAt(0, newComment);
    }
  }
});
