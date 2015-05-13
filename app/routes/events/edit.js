import Ember from 'ember';

export default Ember.Route.extend({
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

    afterSave() {
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
