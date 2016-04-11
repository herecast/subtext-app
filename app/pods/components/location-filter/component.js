import Ember from 'ember';
import ManualDropdown from 'subtext-ui/mixins/components/manual-dropdown';

const {
  isPresent,
  observer,
  on,
  get
} = Ember;

export default Ember.Component.extend(ManualDropdown, {
  isSearching: false,
  hasPerformedSearch: false,

  // Pass key/value pairs to add additional hardcoded options to the list.
  otherLocations: [],

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

    api.getLocations(value).then((response) => {
      const locations = response.locations.map((location) => {
        let name = location.city;

        if (isPresent(location.state)) {
          name = `${name}, ${location.state}`;
        }

        return {
          name: name,
          id: location.id
        };
      });

      this.setProperties({
        places: locations,
        open: true,
        isSearching: false
      });
    });
  },

  actions: {
    setLocation(locationName, locationId) {
      this.setProperties({
        location: locationName,
        locationId: locationId,
        inputValue: locationName,
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

      this.send('setLocation', '', null);
    }
  }
});
