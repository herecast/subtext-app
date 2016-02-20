import Ember from 'ember';

const {
  set,
  get,
  run
} = Ember;

export default Ember.Component.extend({
  input: null,

  _setInputElement() {
    const input = this.$('input');

    set(this, 'input', input);
  },

  _bindUpdateFunction(input) {
    input.keyup(event => {
      const value = get(this, 'input').val();

      if (event.keyCode !== 9 && event.keyCode !== 13) {
        run.debounce(this, this.updateSearchTerms, value, 600);
      }
    });
  },

  updateSearchTerms(value) {
    this.attrs.updateFromQuery(value);
  },

  click() {
    get(this, 'input').select();
  },

  didInsertElement() {
    this._setInputElement();
    const $input = get(this, 'input');

    this._bindUpdateFunction($input);
  }
});
