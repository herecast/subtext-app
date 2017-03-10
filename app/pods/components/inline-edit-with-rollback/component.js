import Ember from 'ember';

const {
  get,
  set,
  run,
  on
} = Ember;

export default Ember.Component.extend({
  hasError: false,
  displayWasGiven: false,

  detectDisplay: on('didReceiveAttrs', function({newAttrs}) {

    if('display' in newAttrs) {
      set(this, 'displayWasGiven', true);
    }
  }),

  mayExitEditMode() {
    return !get(this, 'hasError');
  },

  actions: {
    editModeEntered() {
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
