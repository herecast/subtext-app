import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';

export default Ember.Route.extend(Scroll, {
  model(params) {
    return this.store.find('event', params.id);
  },

  redirect() {
    this.transitionTo('events.edit.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('events.index');
    },

    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish() {
      // TODO: go to event show page
      this.transitionTo('events.index');
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});
