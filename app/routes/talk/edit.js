import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import ShareCaching from '../../mixins/routes/share-caching';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseUserLocation from 'subtext-ui/mixins/routes/base-user-location';

const { get, run, isPresent } = Ember;

export default Ember.Route.extend(Scroll, ShareCaching, Authorized, FastbootTransitionRouteProtocol, BaseUserLocation, {

  model(params) {
    return this.store.findRecord('content', params.id, {reload: true});
  },

  redirect(params, transition) {
    this.transitionTo('talk.edit.details', { queryParams: transition.queryParams });
  },

  hasDirtyAttributes(model) {
    return Object.keys(model.changedAttributes()).length > 4;
  },

  attemptDiscard(event, transition) {
    const confirmed = confirm('Are you sure you want to discard this talk?');

    if (confirmed) {
      event.destroyRecord();
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
      const isExitingForm = !transition.targetName.match(`^talk\\.edit`);
      const isTransitioningToShowPage = transition.targetName === 'feed.show' || 'profile.all.show';

      // If we are transitioning to the an talk show page,
      // that means the user clicked the publish button, so we don't
      // want to prompt them to disard their changes
      if (!isTransitioningToShowPage) {
        if (isExitingForm && this.hasDirtyAttributes(model)) {
          this.attemptDiscard(model, transition);
        }
      }
    },

    afterDiscard() {
      this.transitionTo('feed');
    },

    afterDetails() {
      this.transitionTo('talk.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('talk.edit.preview');
    },

    afterPublish(talk) {
      const controller = this.controllerFor(this.routeName);
      const goToProfilePage = isPresent(get(controller, 'organization_id'));

      run.next(() => {
        if (this.hasDirtyAttributes(talk)) {
          talk.rollbackImages();
        }

        run.next(this, () => {
          if (goToProfilePage) {
            this.transitionTo('profile.all.show', get(controller, 'organization_id'), get(talk, 'id'));
          } else {
            this.transitionTo('feed.show', get(talk, 'id'));
          }

        });

        talk.set('listservIds', []);
      });
    },

    backToDetails() {
      this.transitionTo('talk.edit.details');
    }
  }
});
