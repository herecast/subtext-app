import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import Scroll from 'subtext-app/mixins/routes/scroll-to-top';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

export default Route.extend(AuthenticatedRouteMixin, ConfirmationMixin, Scroll, {
  titleToken: 'Create a Post',
  floatingActionButton: service(),

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
    this._super(...arguments);
  },

  actions: {
    willTransition(transition) {
      const model = get(this, 'controller.news');

      if (model.get('hasDirtyAttributes')) {
        if(confirm('Your post has unsaved changes. Do you want to discard them?')) {
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
    },

    refreshRouteModel() {
      const controller = this.controllerFor(this.routeName);
      set(controller, 'hideEditor', true);

      this.refresh();

      later(() => {
        set(controller, 'hideEditor', false);
      }, 500);
    }
  }
});
