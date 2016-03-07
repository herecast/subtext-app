import Ember from 'ember';

const {
  set,
  get,
  run,
  computed,
  isPresent
} = Ember;

export default Ember.Component.extend({
  classNameBindings: ['displaySuggestions:open'],

  input: null,
  query: null,
  categories: null,
  category: null,
  hasCategory: computed('category', function() {
    return (isPresent(get(this, 'category')));
  }),
  categoryMatches: null,

  suggestions: [],
  displaySuggestions: false,

  click() {
    this.$('input').select();
  },

  focusOut() {
    run.later(() => {
      const stillHasFocus = this.$(':focus').length;
      if(! stillHasFocus) {
        set(this, 'displaySuggestions', false);
      }
    }, 100);
  },

  keyUp(e) {
    const esc = 27;

    switch(e.keyCode) {
      case esc:
        this.$('input').blur();
        break;
    }
  },

  _bindUpdateFunction(input) {
    input.on('input',  () => {
      const value = this.$('input').val();

      run.debounce(this, this.updateCategoryMatches, value, 200);
      run.debounce(this, this.updateSearchTerms, value, 500);
    });
  },

  _getCategoryMatches(categories, searchTerms) {
    const re = new RegExp(searchTerms, 'i');

    return categories.filter(category => {
      return category.get('name').match(re);
    });
  },

  updateSearchTerms(value) {
    this.attrs.updateFromQuery(value);
  },

  updateCategoryMatches(searchTerms) {
    if (searchTerms.length >= 2) {
      const categories = get(this, 'categories');
      const categoryMatches = this._getCategoryMatches(categories, searchTerms);

      if (isPresent(categoryMatches)) {
        set(this, 'categoryMatches', categoryMatches);
        set(this, 'displaySuggestions', true);
      } else {
        set(this, 'categoryMatches', []);
        set(this, 'displaySuggestions', false);
      }
    } else {
      set(this, 'categoryMatches', []);
      set(this, 'displaySuggestions', false);
    }
  },

  didInsertElement() {
    const searchTerms = get(this, 'query') || get(this, 'category.name') || null;

    // set initial value
    if (searchTerms) {
      this.$('input').val(searchTerms);
    }
    this._bindUpdateFunction(this.$('input'));
  },

  didUpdateAttrs() {
    const category = get(this, 'attrs.category.value');

    // we have to manually manage the input value
    // since there is some business logic about
    // what should be used for the value
    if (category) {
      this.$('input').val(category.get('name'));
    }
  },

  actions: {
    chooseCategory(category) {
      this.attrs.setCategory(category);
      set(this, 'displaySuggestions', false);
    }
  }
});
