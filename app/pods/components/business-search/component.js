import Ember from 'ember';

const {
  set,
  get,
  run,
  isPresent
} = Ember;

export default Ember.Component.extend({
  input: null,
  query: null,

  _setInputElement() {
    const input = this.$('input');

    set(this, 'input', input);
  },

  _bindUpdateFunction(input) {
    input.keyup(event => {
      const value = get(this, 'input').val();

      if (event.keyCode !== 9 && event.keyCode !== 13) {
        run.debounce(this, this.updateSearchTerms, value, 200);
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
    // TODO replace query with actual property
    const searchTerms = get(this, 'query')
    const $input = get(this, 'input');
    // set initial value
    if (searchTerms) {
      $input.val(searchTerms);
    }
    this._bindUpdateFunction($input);
  },

  didUpdateAttrs() {
    const $input = get(this, 'input');
    const searchTerms = get(this, 'attrs.searchTerms.value');
    const isCategory = get(this, 'attrs.category.value');
    // we have to manually manage the input value
    // since there is some business logic about
    // what should be used for the value
    if (isPresent(searchTerms) && isCategory !== null) {
      $input.val(searchTerms);
    }
  }
});
