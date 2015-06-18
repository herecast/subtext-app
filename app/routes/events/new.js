import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from '../../mixins/routes/authorized';

export default Ember.Route.extend(Scroll, Authorized, {
  model() {
    return this.store.createRecord('event', {
      listservIds: []
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

      this.transitionTo('events.show', firstInstanceId);
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
