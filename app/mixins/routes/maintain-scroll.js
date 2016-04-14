import Ember from 'ember';

const { get } = Ember;

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      const scrollPosition = this.controller.get('scrollPosition');

      if (scrollPosition) {
        Ember.run.later(function() {
          window.scrollTo(0, scrollPosition);
        });
      }

      return true; // bubble action
    },
    willTransition(transition) {
      const scrollPosition = (transition.targetName === get(this, 'routeName')) ? 0 : window.pageYOffset;
      this.controller.set('scrollPosition', scrollPosition);

      return true; // bubble action
    }
  }
});
