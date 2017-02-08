import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      this.send('scrollTo', 0);
      return this._super(...arguments); //bubble
    }
  }
});
