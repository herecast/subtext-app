import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import Scroll from 'subtext-ui/mixins/routes/scroll-to-top';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(Authorized, FastbootTransitionRouteProtocol, Scroll, {
  titleToken: 'Create a Post',

  model(params, transition) {
    let newRecordValues = {
      contentType: 'news'
    };

    if ('organization_id' in transition.queryParams && isPresent(transition.queryParams.organization_id)) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('content', newRecordValues);
      });
    } else {
      return this.store.createRecord('content', newRecordValues);
    }
  },

  setupController(controller, model) {
    controller.set('news', model);
    controller.set('title', 'Create your post');
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
