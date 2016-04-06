import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      this._super(...arguments);

      const scrollPosition = this.controller.get('scrollPosition');

      if (scrollPosition) {
        Ember.run.later(function() {
          window.scrollTo(0, scrollPosition);
        });
      }
    },
    willTransition() {
      this._super(...arguments);

      this.controller.set('scrollPosition', window.pageYOffset);
    }
  }
});
