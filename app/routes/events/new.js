import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { get, run, inject } = Ember;

export default Ember.Route.extend(Scroll, Authorized, {
  intercom: inject.service('intercom'),

  model(params, transition) {
    const newRecordValues = {
      venueStatus: 'new',
      listservIds: []
    };

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('event', newRecordValues);
      });
    } else {
      return this.store.createRecord('event', newRecordValues);
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
      this.transitionTo('events.all').then(() => {
      });
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

      this.transitionTo('events.all.show', firstInstanceId);

      run.next(() => {
        event.set('listservIds',[]);
      });
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
