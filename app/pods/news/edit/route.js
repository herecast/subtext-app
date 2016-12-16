import Ember from 'ember';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import RequireCanEdit from 'subtext-ui/mixins/routes/require-can-edit';

const { get, inject, run } = Ember;

export default Ember.Route.extend(RequireCanEdit, {
  location: inject.service('window-location'),
  titleToken: 'Edit News',

  delayedJobs: inject.service(),

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
      const sharePath = `/news/${modelId}`;
      const locationService = get(this, 'location');

      SocialSharing.updateShareCache(locationService, sharePath);

      let delayedJob =
        run.later(this, () => {
          SocialSharing.checkFacebookCache(locationService, sharePath);
        }, 60 * 1e3);

      get(this, 'delayedJobs').queueJob(`facebookRecache${sharePath}`, delayedJob);
    }
  }
});
