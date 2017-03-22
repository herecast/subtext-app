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

  /**
   * Display attribute is used as a convenience. It's used when the value
   * to display is simply an attribute that can be displayed as is.  It
   * prevents having to specify what to display when not in edit mode
   * via the yielded block.
   */
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
    let canExit = true;

    const willExitEditMode = get(this, 'willExitEditMode');
    const didExitEditMode = get(this, 'didExitEditMode');

    if(willExitEditMode) {
      const result = willExitEditMode();

      /**
       * The context using this component can return false to prevent the
       * inline-edit component from proceeding with exiting edit mode.
       * An example would be if the value does not pass validation.
       */
      if(result !== undefined && result === false) {
        canExit = false;
      }
    }

    if(canExit) {
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

      const didEnterEditMode = get(this, 'didEnterEditMode');
      if(didEnterEditMode) {
        didEnterEditMode();
      }
    }
  }
});
