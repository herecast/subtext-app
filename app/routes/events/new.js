import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from '../../mixins/routes/authorized';
import moment from 'moment';

export default Ember.Route.extend(Scroll, Authorized, {
  mixpanel: Ember.inject.service('mixpanel'),

  model() {
    // New event instances default to noon.
    const startsAt = moment();
    startsAt.hour(12);
    startsAt.minute(0);

    const eventInstance = this.store.createRecord('event-instance', {
      startsAt: startsAt
    });

    return this.store.createRecord('event', {
      listservIds: [],
      eventInstances: [eventInstance]
    });
  },

  redirect() {
    this.transitionTo('events.new.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('events.index');
    },

    afterDetails() {
      this.transitionTo('events.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.new.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('eventInstances.firstObject.id');

      this.get('mixpanel').trackEvent('Event Publish');

      this.transitionTo('events.show', firstInstanceId);
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
