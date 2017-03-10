import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  set,
  on,
  run
} = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['InlineEdit'],
  classNameBindings: ['isEditing:is-editing'],
  isEditing: false,
  focusChangesState: true,

  displayWasGiven: null,

  keyPress(e) {
    if(e.keyCode === 13 /*ENTER*/) {
      if(e.target.tagName === 'INPUT') {
        this.exitEditMode();

        e.preventDefault();
        return false;
      }
    }
  },

  detectDisplay: on('didReceiveAttrs', function({newAttrs}) {
    if('display' in newAttrs) {
      set(this, 'displayWasGiven', true);
    }
  }),

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
    let mayExit = true;
    const willExitEditMode = get(this, 'willExitEditMode');
    const didExitEditMode = get(this, 'didExitEditMode');

    if(willExitEditMode) {
      const result = willExitEditMode();

      if(result !== undefined && result === false) {
        mayExit = false;
      }
    }

    if(mayExit) {
      set(this, 'isEditing', false);
      if(didExitEditMode) {
        didExitEditMode();
      }
    }
  },

  enterEditMode() {
    if(!get(this, 'isEditing')) {
      set(this, 'isEditing', true);
      run.next(()=> this.setFocus());
      if('didEnterEditMode' in this.attrs) {
        this.attrs.didEnterEditMode();
      }
    }
  }
});
