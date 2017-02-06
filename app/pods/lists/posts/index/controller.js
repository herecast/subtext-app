import Ember from 'ember';

const { inject } = Ember;

export default Ember.Controller.extend({
  showPreview: false,
  features: inject.service('feature-flags'),

  actions: {
    previewEnhancedPost() {
      this.transitionToRoute('lists.posts.preview');
    }
  }
});
