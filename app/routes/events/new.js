import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('event');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('events.index');
    },

    afterSave() {
      this.transitionTo('events.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.new.preview');
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
