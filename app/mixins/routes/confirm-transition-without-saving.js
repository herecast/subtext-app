import Ember from 'ember';

const { get } = Ember;

/**
 * Reusable, extensible mixin for prompting a user
 * to revert their changes before the route transitions.
 */
export default Ember.Mixin.create({

  /**
   * Message displayed to prompt the user to discard changes
   */
  confirmTransitionMessage: 'Are you sure you want to discard your changes?',

  /**
   * Key name for the path to the model to check for existing changes / revert
   */
  keyForModel: 'controller.model',

  /**
   * Ask the user if they want to discard their changes
   * @param transition
   */
  promptToDiscardChanges(transition) {
    const confirmed = confirm(get(this, 'confirmTransitionMessage'));

    if (confirmed) {
      this.rollbackAttributes();
    } else {
      transition.abort();
    }
  },

  /**
   * Check if the model has dirty attributes.
   */
  hasDirtyAttributes() {
    const keyForModel = get(this, 'keyForModel');
    return get(this, `${keyForModel}.hasDirtyAttributes`);
  },

  /**
   * Revert changes to model (removes from store if model.isNew)
   */
  rollbackAttributes() {
    get(this, get(this, 'keyForModel')).rollbackAttributes();
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      if (this.hasDirtyAttributes()) {
        this.promptToDiscardChanges(transition);
      }
    }
  }
});
