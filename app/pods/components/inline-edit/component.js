import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  set,
  run
} = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['InlineEdit'],
  classNameBindings: ['isEditing:is-editing'],
  isEditing: false,
  focusChangesState: true,

  valueWasGiven: null,

  keyPress(e) {
    if(e.keyCode === 13 /*ENTER*/) {
      if(e.target.tagName === 'INPUT') {
        this.exitEditMode();

        e.preventDefault();
        return false;
      }
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);

    set(this, 'valueWasGiven', ('value' in this.attrs));
  },

  setFocus() {
    if(!get(this, 'isDestroying')) {
      this.$('input,select,textarea').focus();
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
