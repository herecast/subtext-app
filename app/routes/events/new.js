import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';

export default Ember.Route.extend(Scroll, {
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

    afterPublish() {
      this.transitionTo('events.index');
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
