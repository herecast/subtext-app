import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition() {
      this._super(...arguments);

      const controller = this.controllerFor("application");
      controller.setShowUserLocationBar(true);
    },

    willTransition(transition) {
      this._super(...arguments);

      const targetRouteName = transition.targetName;
      const toSameRoute = targetRouteName.startsWith(this.routeName);

      if (!toSameRoute) {
        const controller = this.controllerFor("application");
        controller.setShowUserLocationBar(false);
      }
    }
  }
});
