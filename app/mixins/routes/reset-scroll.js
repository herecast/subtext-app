import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      this._super(...arguments);

      window.scrollTo(0,0);
    }
  }
});
