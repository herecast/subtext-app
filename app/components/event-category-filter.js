import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  categories: [
    'everything', 'family', 'movies', 'music', 'wellness', 'yardsales'
  ],

  categoryOptions: function() {
    return this.get('categories').map((category) => {
      return {
        label: category.capitalize(),
        value: category
      };
    });
  }.property(),

  initInput: function() {
    const query = this.get('query');

    if (Ember.isPresent(query)) {
      this.setInput(query);
    } else {
      const category = this.get('category');
      this.setInput(category);
    }

    this.$('input').keyup(() => {
      const query = this.get('categoryOrQuery');
      this.setInput(query);
    });
  }.on('didInsertElement'),

  removeQueryInput: function() {
    this.$('input').off('keyUp');
  }.on('willDestroyElement'),

  // Since the input field handles both the hardcoded categories and custom text
  // input, we have to manually manage the values. If the user enters one of the
  // hardcoded categories, it uses that, otherwise it sends it as a custom query.
  setInput(value) {
    if (!this.get('categories').contains(value)) {
      this.setProperties({
        category: 'everything',
        query: value,
        categoryOrQuery: value,
      });
    } else {
      this.setProperties({
        categoryOrQuery: value,
        category: value,
        query: null
      });
    }
  },

  actions: {
    setCategory(category) {
      this.setInput(category);
    }
  }
});
