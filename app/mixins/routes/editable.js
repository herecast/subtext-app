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

      // We want to let the user continue to navigate through the
      // event/market/talk edit form routes without discarding changes,
      // but as soon as they try to leave those pages, prompt them with the dialog.
      const match = new RegExp(`^${this.routeNamePrefix()}\\.edit`);
      const isExitingForm = !transition.targetName.match(match);

      if (isExitingForm && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
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
