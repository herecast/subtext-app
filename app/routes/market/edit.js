import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import Scroll from '../../mixins/routes/scroll-to-top';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RequireCanEdit from 'subtext-ui/mixins/routes/require-can-edit';

export default Route.extend(RequireCanEdit, Scroll, Authorized, FastbootTransitionRouteProtocol, {
  location: service('window-location'),
  userLocation: service(),

  model(params) {
    return this.store.findRecord('content', params.id, {reload: true});
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting the contact info when the model loads. This will give us some
  // false positives, meaning it will tell the user there are changes when
  // there are not, but that seems better than false negatives.
  hasDirtyAttributes(model) {
    const modelIsDirty = Object.keys(model.changedAttributes()).length >= 1;

    // Ember data doesn't detect dirty attributes on relationship records,
    // so we need to do that manually.
    const imageHasDirtyAttrs = get(model, 'images').any((image) => {
      return get(image, 'hasDirtyAttributes');
    });

    return modelIsDirty || imageHasDirtyAttrs;
  },

  redirect() {
    this.transitionTo('market.edit.details');
  },

  // Ember data doesn't automatically rollback relationship records, so we
  // need to do that manually if the market post is rolled back.
  attemptDiscard(model, transition) {
    const confirmed = confirm('Are you sure you want to discard changes without saving?');

    if (confirmed) {
      model.rollbackImages();
      model.set('listservIds', []);
      model.rollbackAttributes();
    } else {
      transition.abort();
    }
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const model = get(this, 'controller.model');

      // We want to let the user continue to navigate through the
      // event/market/talk edit form routes without discarding changes,
      // but as soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(`^market\\.edit`);
      const isTransitioningToShowPage = transition.targetName === 'feed.show' || 'profile.all.show';

      // If we are transitioning to the an event show page,
      // that means the user clicked the publish button, so we don't
      // want to prompt them to disard their changes
      if (!isTransitioningToShowPage) {
        if (isExitingForm && this.hasDirtyAttributes(model)) {
          this.attemptDiscard(model, transition);
        }
      }
    },

    afterDiscard() {
      const controller = this.controllerFor(this.routeName);
      const organizationId = get(controller, 'organization_id') || null;

      if (isPresent(organizationId)) {
        this.transitionTo('profile', organizationId);
      } else {
        this.transitionTo('feed');
      }
    },

    afterDetails() {
      this.transitionTo('market.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.edit.preview');
    },

    afterPublish(post) {
      // Rollback the images after persisting changes so that the user can
      // transition to the show page without seeing a "discard changes" modal.
      // Normally ember data does this automatically on save, but does not do
      // it for relationship records.
      const controller = this.controllerFor(this.routeName);
      const goToProfilePage = isPresent(get(controller, 'organization_id'));

      run.next(() => {
        if (this.hasDirtyAttributes(post)) {
          post.rollbackImages();
        }

        run.next(this, () => {
          if (goToProfilePage) {
            this.transitionTo('profile.all.show', get(controller, 'organization_id'), get(post, 'id'));
          } else {
            this.transitionTo('feed.show', post.id, {
              queryParams: {
                type: 'market'
              }
            });
          }
        });

        post.set('listservIds', []);
      });
    },

    backToDetails() {
      this.transitionTo('market.edit.details');
    }
  }
});
