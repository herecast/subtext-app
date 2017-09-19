import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RequireCanEdit from 'subtext-ui/mixins/routes/require-can-edit';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import BaseUserLocation from 'subtext-ui/mixins/routes/base-user-location';

const {
  get,
  run,
  inject
} = Ember;

export default Ember.Route.extend(RequireCanEdit, Scroll, Authorized, BaseUserLocation, {
  location: inject.service('window-location'),
  userLocation: inject.service(),

  discardRecord(model) {
    // Ember data doesn't automatically rollback relationship records, so we
    // need to do that manually if the event is rolled back.
    if (confirm('Are you sure you want to discard your changes without saving?')) {
      model.rollbackAttributes();
      model.rollbackSchedules();
      model.resetContentLocationChanges();
      model.set('listservIds',[]);
      return true;
    } else {
      return false;
    }
  },

  model(params) {
    return this.store.findRecord('event', params.id, {reload: true});
  },

  redirect() {
    this.transitionTo('events.edit.details');
  },

  hasDirtyAttributes(event) {
    const eventHasDirtyAttrs = get(event, 'hasDirtyAttributes');

    // Ember data doesn't detect dirty attributes on relationship records,
    // so we need to do that manually.
    const scheduleHasDirtyAttrs = get(event, 'schedules').any((schedule) => {
      return get(schedule, 'hasDirtyAttributes');
    });

    return eventHasDirtyAttrs || scheduleHasDirtyAttrs;
  },

  actions: {
    willTransition(transition) {
      const model = get(this, 'controller.model');
      // We want to let the user continue to navigate through the
      // event/market/talk edit form routes without discarding changes,
      // but as soon as they try to leave those pages, prompt them with the dialog.
      const match = new RegExp(`^events\\.edit`);
      const isExitingForm = !transition.targetName.match(match);
      const isTransitioningToShowPage = transition.targetName === 'events.show';

      // If we are transitioning to the an event show page,
      // that means the user clicked the publish button, so we don't
      // want to prompt them to disard their changes
      if (!isTransitioningToShowPage) {
        if (isExitingForm && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
          transition.abort();
        }
      }
    },

    afterDiscard() {
      this.transitionTo(`location.events`, get(this, 'userLocation.location'));
    },

    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('firstInstanceId');
      const locationService = get(this, 'location');

      // Rollback the schedules after persisting changes so that the user can
      // transition to the show page without seeing a "discard changes" modal.
      // Normally ember data does this automatically on save, but does not do
      // it for relationship records.
      run.next(() => {
        if (this.hasDirtyAttributes(event)) {
          event.rollbackSchedules();
        }

        // Unset so not checked the next time this event is edited.
        event.set('listservIds',[]);

        SocialSharing.checkFacebookCache(locationService, event).finally(() => {
          this.transitionTo('events.show', firstInstanceId);
        });
      });
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
