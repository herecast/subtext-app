import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      this._super(...arguments);

      Ember.$('.ember-application > .ember-view').scrollTop(0);
    }
  }
});
