import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';

const { get } = Ember;

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, {
  intercom: Ember.inject.service('intercom'),
  mixpanel: Ember.inject.service('mixpanel'),

  model() {
    return this.store.createRecord('event', {
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
  // setting a default listservIds value.
  hasDirtyAttributes(event) {
    return Object.keys(event.changedAttributes()).length > 1;
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

        const mixpanel = this.get('mixpanel');
        const currentUser = this.get('session.currentUser');
        const props = {};

        Ember.merge(props, mixpanel.getUserProperties(currentUser));
        Ember.merge(props, mixpanel.getNavigationControlProperties('Create Event', 'Discard Event'));
        mixpanel.trackEvent('selectNavControl', props);
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
