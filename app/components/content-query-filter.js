import Ember from 'ember';
import ManualDropdown from '../mixins/components/manual-dropdown';

export default Ember.Component.extend(ManualDropdown, {
  click() {
    this.$('input').select();
  },

  initInput: function() {
    this.$('input').keyup((e) => {
      const value = this.get('query');
      // Don't initiate a search if someone is tabbing through filters
      // or hits return.
      if (e.keyCode !== 9 && e.keyCode !== 13) {
        if (Ember.isPresent(value) && value.length > 2) {
          Ember.run.debounce(this, this.updateFilter, value, 800);
        }
      }
    });
  }.on('didInsertElement'),

  updateFilter() {
    if (Ember.isPresent(this.get('query'))) {
      this.set('open', false);
      this.sendAction('submit');
    }
  },

  removeQueryInput: function() {
    this.$('input').off('keyUp');
  }.on('willDestroyElement'),

  actions: {
    setQuery(query) {
      this.setProperties({
        query: query,
        open: false
      });

      // This prevents the input from being selected when a user chooses a
      // location from the dropdown menu.
      Ember.run.later(() => {
        this.updateFilter();
      }, 10);
    },

    customSearch() {
      Ember.run.later(() => {
        this.$('input').focus();
      }, 50);

      this.send('setQuery', '');
    }
  }
});
