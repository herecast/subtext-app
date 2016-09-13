import Ember from 'ember';

const { get, isPresent } = Ember;

export default Ember.Route.extend({

  model() {
    return this.modelFor('lists.posts');
  },

  redirect(model) {
    if (isPresent(get(model, 'verifiedAt'))) {
      this.transitionTo('lists.posts.preview');
    }
  }
});
