import Ember from 'ember';

export default Ember.Controller.extend({
  showPreview: false,

  actions: {
    previewEnhancedPost() {
      this.transitionToRoute('lists.posts.preview');
    }
  }
});
