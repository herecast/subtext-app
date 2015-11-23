import Ember from 'ember';

const { run, on, computed, get, set, isPresent, isBlank } = Ember;
const CATEGORIES = [ 'Everything', 'Movies', 'Performing arts', 'Wellness', 'Holidays' ];

export default Ember.Component.extend({
  classNames: ['dropdown'],

  category: null,
  query: null,
  categoryOrQuery: null,

  categoryOptions: computed(() => {
    return CATEGORIES.map((category) => {
      return {
        label: category.capitalize(),
        value: category
      };
    });
  }),

  click() {
    this.$('input').select();
  },

  didUpdateAttrs() {
    const category = this.getAttr('category'),
          query    = this.getAttr('query'),
          categoryOrQuery = (isPresent(query)) ? query : category;

    set(this, 'categoryOrQuery', categoryOrQuery);
  },

  initInput: on('didInsertElement', function() {
    const $input = this.$('input');

    $input.blur(() => {
      if ($input.val() === '') {
        $input.val(CATEGORIES[0].capitalize());
        this.updateFilter();
      }
    });

    $input.keyup((e) => {
      const query = get(this, 'categoryOrQuery');

      this.setInputValue(query);

      // Don't initiate a search if someone is tabbing through filters
      // or hits return.
      if (e.keyCode !== 9 && e.keyCode !== 13) {
        if (isPresent(query) && query.length > 2) {
          run.debounce(this, this.updateFilter, query, 300);
        } else if (isBlank(query)) {
          run.later(() => {
            $input.val('');
          });
        }
      }
    });
  }),

  updateFilter() {
    this.sendAction('submit');
  },

  // Since the input field handles both the hardcoded categories and custom text
  // input, we have to manually manage the values. If the user enters one of the
  // hardcoded categories, it uses that, otherwise it sends it as a custom query.
  setInputValue(value) {
    const valueIsCategory = (CATEGORIES.contains(value));

    this.setProperties({
      category: (valueIsCategory) ? value : 'Everything',
      query:    (valueIsCategory) ? null  : value,
    });
  },

  willDestroyElement() {
    this.$('input').off('keyUp').off('blur');
  },

  actions: {
    setCategory(category) {
      this.setInputValue(category);

      // This prevents the input from being selected when a user chooses a
      // category from the dropdown menu.
      run.later(() => {
        this.updateFilter();
      }, 10);
    },

    customSearch() {
      run.later(() => {
        this.$('input').focus();
      }, 50);

      this.$('input').val('');
    }
  }
});
