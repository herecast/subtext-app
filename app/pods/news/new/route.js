import Ember from 'ember';
import Scroll from 'subtext-ui/mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import SocialSharing from 'subtext-ui/utils/social-sharing';

const { get, inject } = Ember;

export default Ember.Route.extend(Authorized, Scroll, {
  location: inject.service('window-location'),
  titleToken: 'Create News',

  model(params, transition) {
    let newRecordValues = {};

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('news', newRecordValues);
      });
    } else {
      return this.store.createRecord('news');
    }
  },

  setupController(controller, model) {
    controller.set('news', model);
    controller.set('title', 'Create your news post');
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
      const locationService = get(this, 'location');

      SocialSharing.createShareCache(locationService, `/news/${modelId}`);
    }
  }
});
