import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get } = Ember;

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, trackEvent, {
  intercom: Ember.inject.service('intercom'),

  model() {
    return this.store.createRecord('event', {
      venueStatus: 'new',
      listservIds: []
    });
  },

  redirect() {
    this.transitionTo('events.new.details');
  },

  discardRecord(event) {
    if (confirm('Are you sure you want to discard this event?')) {
      event.destroyRecord();

      return true;
    } else {
      return false;
    }
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting default listservIds and venueStatus values.
  hasDirtyAttributes(event) {
    return Object.keys(event.changedAttributes()).length > 2;
  },

  _getTrackingArguments() {
    return {
       navigationControlProperties: ['Create Event', 'Discard Event']
    };
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const event = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new event form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^events\.new/);

      if (isExitingForm && this.hasDirtyAttributes(event) && !this.discardRecord(event)) {
        transition.abort();
      }
    },

    afterDiscard(event) {
      if (!this.hasDirtyAttributes(event) || this.discardRecord(event)) {
        this.transitionTo('events.all');

        // TODO this is actually fired twice, this reporting isn't accurate
        this.trackEvent('selectNavControl');
      }
    },

    afterDetails() {
      this.transitionTo('events.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.new.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('firstInstanceId');

      this.get('intercom').trackEvent('published-event');

      this.transitionTo('events.show', firstInstanceId).then(this.facebookRecache);
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
