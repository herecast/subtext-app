import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import RequireCanEdit from 'subtext-ui/mixins/routes/require-can-edit';

const {
  get,
  run
} = Ember;

export default Ember.Route.extend(RequireCanEdit, Scroll, Authorized, {
  discardRecord(model) {
    // Ember data doesn't automatically rollback relationship records, so we
    // need to do that manually if the event is rolled back.
    if (confirm('Are you sure you want to discard your changes without saving?')) {
      model.rollbackAttributes();
      model.rollbackSchedules();
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
      const isTransitioningToShowPage = transition.targetName === 'events.all.show';

      // If we are transitioning to the an event show page,
      // that means the user clicked the publish button, so we don't
      // want to prompt them to disard their changes
      if (!isTransitioningToShowPage) {
        if (isExitingForm && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
          transition.abort();
        }
      }
    },

    afterDiscard(model) {
      if (!get(model, 'hasDirtyAttributes')) {
        this.transitionTo(`events.all`);
      }
    },

    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('firstInstanceId');

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
      });

      this.transitionTo('events.all.show', firstInstanceId).then(() => {
        SocialSharing.updateShareCache();
      });
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
