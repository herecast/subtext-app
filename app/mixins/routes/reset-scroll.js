import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      this._super(...arguments);

      this.send('scrollTo', 0);
    }
  }
});
