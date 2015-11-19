import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  displayListservs: function() {
    if (Ember.isPresent(this.get('post.listservIds'))) {
      this.set('listsEnabled', true);
    }
  }.on('didInsertElement'),

  // When the user unchecks the button to add listservs, reset the array
  // so that we don't subscribe them to a list without their knowledge.
  resetListservs: function() {
    if (!this.get('listsEnabled')) {
      this.set('post.listservIds', []);
    }
  }.observes('listsEnabled'),

  actions: {
    back() {
      this.sendAction('backToDetails');
    },

    preview() {
      this.sendAction('afterPromotion');
    },

    discard() {
      if (confirm('Are you sure you want to discard this post?')) {
        const post = this.get('post');
        post.destroyRecord();
        this.sendAction('afterDiscard');
      }
    },

    toggleProperty(property) {
      this.toggleProperty(property);
    }
  }
});
