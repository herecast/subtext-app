import Ember from 'ember';
import SocialSharing from 'subtext-ui/utils/social-sharing';

const { get } = Ember;

export default Ember.Route.extend({
  titleToken: 'Edit News',

  model(params) {
    return this.store.findRecord('news', params.id, { reload: true });
  },

  setupController(controller, model) {
    controller.set('news', model);
    controller.set('title', 'Edit your news post');
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
      const modelId = get(this, 'controller.news.id');

      SocialSharing.updateShareCache(`/news/${modelId}`);
    }
  }
});
