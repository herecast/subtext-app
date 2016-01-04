import Ember from 'ember';

const { get } = Ember;

export default Ember.Mixin.create({
  routeNamePrefix() {
    return this.routeName.split('.')[0];
  },

  discardRecord(model) {
    if (confirm('Are you sure you want to discard your changes without saving?')) {
      model.rollbackAttributes();

      return true;
    } else {
      return false;
    }
  },

  // Override in content classes when mixed in
  // hasDirtyAttributes(model) {
  // },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const model = get(this, 'controller.model');
      const match = new RegExp(`^${this.routeNamePrefix()}\\.edit`);
      const exitSetup = !transition.targetName.match(match);

      if (exitSetup && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
        transition.abort();
      }
    },

    afterDiscard(model) {
      if (!get(model, 'hasDirtyAttributes') || this.discardRecord(model)) {
        this.transitionTo(`${this.routeNamePrefix()}.all`);
      }
    }
  }
});
