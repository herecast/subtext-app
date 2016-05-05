import Ember from 'ember';

const { get } = Ember;

export default Ember.Route.extend({
  titleToken: 'Edit News',

  model(params) {
    return this.store.findRecord('news', params.id, { reload: true });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('title', 'Edit your news post');
    controller.set('secondaryBackground', true);
  },

  actions: {
    willTransition(transition) {
      const model = get(this, 'controller.model');

      if (model.get('hasUnpublishedChanges')) {
        if(confirm('Your post has unsaved changes. Do you want to discard them?')) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});
