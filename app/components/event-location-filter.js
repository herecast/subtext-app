import Ember from 'ember';
import ManualDropdown from '../mixins/components/manual-dropdown';

const { get, inject, on, observer } = Ember;

export default Ember.Component.extend(ManualDropdown, {
  api: inject.service('api'),
  isSearching: false,
  hasPerformedSearch: false,

  click() {
    this.$('input').select();
  },

  setInputValue: observer('location', function() {
    this.set('inputValue', this.get('location'));
  }),

  initInputValue: on('init', function() {
    this.setInputValue();
  }),

  initInput: on('didInsertElement', function() {
    this.$('input').keyup((e) => {
      const value = this.get('inputValue');

      // Don't initiate a search if someone is tabbing through filters
      if (e.keyCode !== 9) {
        if (Ember.isPresent(value) && value.length > 2) {
          this.set('hasPerformedSearch', true);
          this.set('isSearching', true);
          Ember.run.debounce(this, this.sendSearchQuery, value, 300);
        }
      }
    });
  }),

  removeQueryInput: on('willDestroyElement', function() {
    this.$('input').off('keyUp');
  }),

  updateFilter() {
    this.set('open', false);
    this.sendAction('submit');
  },

  sendSearchQuery(value) {
    const api = get(this, 'api');

    this.set('location', value);

    api.getVenueLocations(value).then((response) => {
      this.setProperties({
        places: response.venue_locations,
        open: true,
        isSearching: false
      });
    });
  },

  actions: {
    setLocation(location) {
      this.setProperties({
        location: location,
        inputValue: location,
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

      this.send('setLocation', '');
    }
  }
});
