import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseUserLocation from 'subtext-ui/mixins/routes/base-user-location';

const { get, run, inject, isPresent } = Ember;

export default Ember.Route.extend(Scroll, Authorized, FastbootTransitionRouteProtocol, BaseUserLocation, {
  location: inject.service('window-location'),
  userLocation: inject.service(),

  model(params, transition) {
    const newRecordValues = {
      venueStatus: 'new',
      promoteRadius: 10,
      ugcJob: params.job,
      contentType: 'event',
      listservIds: []
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
    this.transitionTo('events.new.details', { queryParams: transition.queryParams });
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting default listservIds and venueStatus values.
  hasDirtyAttributes(event) {
    return Object.keys(event.changedAttributes()).length > 2;
  },

  attemptDiscard(event, transition) {
    const confirmed = confirm('Are you sure you want to discard this event?');

    if (confirmed) {
      event.destroyRecord();
    } else {
      transition.abort();
    }
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const event = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new event form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^events\.new/);

      if (isExitingForm && this.hasDirtyAttributes(event)) {
        this.attemptDiscard(event, transition);
      }
    },

    afterDiscard() {
      this.transitionTo('feed');
    },

    afterDetails() {
      this.transitionTo('events.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.new.preview');
    },

    afterPublish(event) {
      const firstInstanceId = get(event, 'eventInstanceId');
      const contentId = get(event, 'id');

      const controller = this.controllerFor(this.routeName);
      const goToProfilePage = isPresent(get(controller, 'organization_id'));

      run.next(() => {
        event.set('listservIds',[]);

        if (goToProfilePage) {
          this.transitionTo('profile.all.show-instance', get(controller, 'organization_id'), contentId, firstInstanceId);
        } else {
          this.controllerFor('feed').set('model', []);
          this.transitionTo('feed.show-instance', contentId, firstInstanceId, {
            queryParams: {
              type: 'calendar'
            }
          });
        }
      });
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
