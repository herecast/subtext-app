import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import RequireCanEdit from 'subtext-app/mixins/routes/require-can-edit';

export default Route.extend(RequireCanEdit, {
  titleToken: 'Edit Post',

  floatingActionButton: service(),

  model(params) {
    return this.store.findRecord('content', params.id, { reload: true });
  },

  setupController(controller, model) {
    controller.set('news', model);
    controller.set('title', 'Edit your post');
    controller.set('secondaryBackground', true);
  },

  actions: {
    willTransition(transition) {
      const model = get(this, 'controller.news');

      if (model.get('hasDirtyAttributes')) {
        if (confirm('Your post has unsaved changes. Do you want to discard them?')) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    },

    afterPublish() {
      const model = get(this, 'controller.news');
      get(this, 'floatingActionButton').launchContent(model);
      this.transitionTo('profile.all.show', get(model, 'organizationId'), get(model, 'id'));
    }
  }
});
