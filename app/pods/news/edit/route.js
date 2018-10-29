import Route from '@ember/routing/route';
import { get } from '@ember/object';
import RequireCanEdit from 'subtext-ui/mixins/routes/require-can-edit';

export default Route.extend(RequireCanEdit, {
  titleToken: 'Edit Post',

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

      if (model.get('hasUnpublishedChanges')) {
        if(confirm('Your post has unsaved changes. Do you want to discard them?')) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    },

    afterPublish() {
    }
  }
});
