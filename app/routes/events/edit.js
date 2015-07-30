import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from '../../mixins/routes/authorized';

export default Ember.Route.extend(Scroll, Authorized, {
  model(params) {
    return this.store.find('event', params.id);
  },

  redirect() {
    this.transitionTo('events.edit.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('events.all');
    },

    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('eventInstances.firstObject.id');

      this.transitionTo('events.show', firstInstanceId);
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
