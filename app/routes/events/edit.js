import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';
import Editable from 'subtext-ui/mixins/routes/editable';

const { get } = Ember;

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, Editable, {
  model(params) {
    return this.store.findRecord('event', params.id, {reload: true});
  },

  redirect() {
    this.transitionTo('events.edit.details');
  },

  hasDirtyAttributes(event) {
    return get(event, 'hasDirtyAttributes');
  },

  actions: {
    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('firstInstanceId');

      this.transitionTo('events.show', firstInstanceId).then(this.prerenderRecache.bind(this));
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
