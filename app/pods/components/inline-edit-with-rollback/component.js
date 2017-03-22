import Ember from 'ember';

const {
  get,
  set,
  run,
  on
} = Ember;

/**
 * This component wraps the inline-edit component with the ability to rollback
 * changes, and it does not allow the exit of edit mode when there is an error.
 * (hasError is truthy)
 */
export default Ember.Component.extend({
  hasError: false,
  displayWasGiven: false,


  /**
   * The purpose of this is to detect if the display attribute was given,
   * so we can pass it to the wrapped inline-edit component.  Which has different
   * behavior based on the presence of this attribute.
   *
   * See inline-edit component
   */
  detectDisplay: on('didReceiveAttrs', function({newAttrs}) {

    if('display' in newAttrs) {
      set(this, 'displayWasGiven', true);
    }
  }),

  /**
   * This is the mechanism used to return true/false to the
   * inline-edit#willExitEditMode action, which tells the inline-edit component
   * if it is allowed to exit edit mode.
   */
  canExitEditMode() {
    return !get(this, 'hasError');
  },

  actions: {
    cacheExistingValueForRollback() {
      set(this, '_rollbackValue',
        get(this, 'value')
      );
    },

    rollback(exit) {
      const rollbackValue = get(this, '_rollbackValue') || get(this, 'value');
      get(this, 'rollback')(rollbackValue);
      run.next(exit);
    }
  }
});
