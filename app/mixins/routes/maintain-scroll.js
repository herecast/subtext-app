import Ember from 'ember';

const { get } = Ember;

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      const scrollPosition = this.controller.get('scrollPosition');

      if (scrollPosition) {
        Ember.run.later(function() {
          Ember.$('.ember-application > .ember-view').scrollTop(scrollPosition);
        });
      }

      return true; // bubble action
    },

    willTransition(transition) {
      let scrollPosition;

      if ((this.routeName !== 'directory') && transition.targetName === 'directory.index') {
        Ember.$('.ember-application > .ember-view').scrollTop(0);

        this.controller.set('scrollPosition', 0);

        return true;
      }

      if (transition.state.queryParams.page) {
        Ember.$('.ember-application > .ember-view').scrollTop(0);

        scrollPosition = 0;
      } else {
        scrollPosition = (transition.targetName === get(this, 'routeName')) ? 0 : Ember.$('.ember-application > .ember-view').pageYOffset;
      }

      this.controller.set('scrollPosition', scrollPosition);

      return true; // bubble action
    }
  }
});
