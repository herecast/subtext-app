import Ember from 'ember';

const {
  get,
  set,
  run
} = Ember;

export default Ember.Component.extend({
  classNames: ['InlineEdit'],
  classNameBindings: ['isEditing:is-editing'],
  isEditing: false,
  focusChangesState: true,

  setFocus() {
    if(!get(this, 'isDestroying')) {
      this.$('input,select,textarea').trigger('focus');
    }
  },

  focusOut() {
    if(!get(this, 'isDestroying') && get(this, 'focusChangesState')) {
      this.exitEditMode();
    }
  },

  exitEditMode() {
    set(this, 'isEditing', false);
    if('didExitEditMode' in this.attrs) {
      this.attrs.didExitEditMode();
    }
  },

  enterEditMode() {
    if(!get(this, 'isEditing')) {
      set(this, 'isEditing', true);
      run.next(()=> this.setFocus());
    }
  }
});
