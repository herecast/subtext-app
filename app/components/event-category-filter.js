import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  click() {
    this.$('input').select();
  },

  categories: [
    'Everything', 'Movies', 'Performing arts', 'Wellness', 'Yard sales'
  ],

  categoryOptions: function() {
    return this.get('categories').map((category) => {
      return {
        label: category.capitalize(),
        value: category
      };
    });
  }.property(),

  setCategoryOrQuery: function() {
    const query = this.get('query');

    if (Ember.isPresent(query)) {
      this.set('categoryOrQuery', query);
    } else {
      this.set('categoryOrQuery', this.get('category'));
    }
  }.observes('category', 'query'),

  initInput: function() {
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
        category: 'Everything',
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

      // This prevents the input from being selected when a user chooses a
      // category from the dropdown menu.
      Ember.run.later(() => {
        this.$('input').blur();
      }, 10);
    }
  }
});
