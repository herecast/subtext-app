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

  // TODO use this method or fold it into _bindUpdateFunction
  keyUp(e) {
    const esc = 27;

    switch(e.keyCode) {
      case esc:
        this.$('input').blur();
        break;
    }
  },

  _bindUpdateFunction(input) {
    input.keyup(event => {
      const value = this.$('input').val();

      if (event.keyCode !== 9 && event.keyCode !== 13) {
        run.debounce(this, this.updateSearchTerms, value, 200);
      }
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

  didInsertElement() {
    const searchTerms = get(this, 'query') || get(this, 'category.name') || null;

    // set initial value
    if (searchTerms) {
      this.$('input').val(searchTerms);
    }
    this._bindUpdateFunction(this.$('input'));
  },

  didUpdateAttrs() {
    const searchTerms = get(this, 'attrs.searchTerms.value');
    const category = get(this, 'attrs.category.value');

    if (searchTerms.length >= 3) {
      const categories = get(this, 'categories');
      const categoryMatches = this._getCategoryMatches(categories, searchTerms);

      if (categoryMatches) {
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
