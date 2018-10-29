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
    return this.store.findRecord('content', params.id, {reload: true});
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
      const isTransitioningToShowPage = transition.targetName === 'feed.show-instance' || 'profile.all.show-instance';

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
      const controller = this.controllerFor(this.routeName);
      const organizationId = get(controller, 'organization_id') || null;

      if (isPresent(organizationId)) {
        this.transitionTo('profile', organizationId);
      } else {
        this.transitionTo('feed');
      }
    },

    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('eventInstanceId');
      const contentId = get(event, 'contentId');

      const controller = this.controllerFor(this.routeName);
      const goToProfilePage = isPresent(get(controller, 'organization_id'));

      // Rollback the schedules after persisting changes so that the user can
      // transition to the show page without seeing a "discard changes" modal.
      // Normally ember data does this automatically on save, but does not do
      // it for relationship records.
      run.next(() => {
        //if (this.hasDirtyAttributes(event)) {
        //  event.rollbackSchedules();
        //}

        // Unset so not checked the next time this event is edited.
        event.set('listservIds',[]);

        if (goToProfilePage) {
          this.transitionTo('profile.all.show-instance', get(controller, 'organization_id'), contentId, firstInstanceId);
        } else {
          this.transitionTo('feed.show-instance', contentId, firstInstanceId, {
            queryParams: {
              type: 'calendar'
            }
          });
        }
      });
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
