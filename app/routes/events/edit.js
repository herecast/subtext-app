import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, {
  model(params) {
    return this.store.findRecord('event', params.id, {reload: true});
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

      this.transitionTo('events.show', firstInstanceId).then(this.prerenderRecache.bind(this));
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
