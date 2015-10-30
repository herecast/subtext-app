import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(Scroll, Authorized, {
  intercom: Ember.inject.service('intercom'),

  model() {
    const eventInstance = this.store.createRecord('event-instance');

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
      this.transitionTo('events.all');
    },

    afterDetails() {
      this.transitionTo('events.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.new.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('eventInstances.firstObject.id');

      this.get('intercom').trackEvent('published-event');

      this.transitionTo('events.show', firstInstanceId, {queryParams: { recacheFB: true }});
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
