import Ember from 'ember';
import Scroll from 'subtext-ui/mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get } = Ember;

export default Ember.Route.extend(Authorized, Scroll, trackEvent, {
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
    controller.set('model', model);
    controller.set('title', 'Create your news post');
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
