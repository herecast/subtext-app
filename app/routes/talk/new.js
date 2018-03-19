import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import ShareCaching from '../../mixins/routes/share-caching';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseUserLocation from 'subtext-ui/mixins/routes/base-user-location';

const { get, run, isPresent } = Ember;

export default Ember.Route.extend(Scroll, ShareCaching, Authorized, FastbootTransitionRouteProtocol, BaseUserLocation, {

  model(params, transition) {
    let newRecordValues = {
      viewCount: 0,
      promoteRadius: 10,
      contentType: 'talk',
      ugcJob: params.job,
      authorName: this.get('session.currentUser.name')
    };

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('content', newRecordValues);
      });
    } else {
      return this.store.createRecord('content', newRecordValues);
    }
  },

  redirect(params, transition) {
    this.transitionTo('talk.new.details', { queryParams: transition.queryParams });
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting default values.
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

      const talk = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new talk form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^talk\.new/);

      if (isExitingForm && this.hasDirtyAttributes(talk)) {
        this.attemptDiscard(talk, transition);
      }
    },

    afterDiscard() {
      this.transitionTo('feed');
    },

    afterDetails() {
      this.transitionTo('talk.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('talk.new.preview');
    },

    afterPublish(talk) {
      const controller = this.controllerFor(this.routeName);
      const goToProfilePage = isPresent(get(controller, 'organization_id'));

      run.next(() => {
        if (goToProfilePage) {
          this.transitionTo('profile.all.show', get(controller, 'organization_id'), get(talk, 'id'));
        } else {
          this.transitionTo('feed.show', get(talk, 'id'), {
            queryParams: {
              radius: 50
            }
          });
        }
      });
    },

    backToDetails() {
      this.transitionTo('talk.new.details');
    }
  }
});
