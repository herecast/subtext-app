import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    back() {
      this.sendAction('backToDetails');
    },

    preview() {
      this.sendAction('afterPromotion');
    },

    discard() {
      const model = this.get('model');

      this.sendAction('afterDiscard', model);
    },

    toggleProperty(property) {
      this.toggleProperty(property);
    }
  }
});
