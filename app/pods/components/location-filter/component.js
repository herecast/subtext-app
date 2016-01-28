import Ember from 'ember';
import ajax from 'ic-ajax';
import config from 'subtext-ui/config/environment';
import ManualDropdown from 'subtext-ui/mixins/components/manual-dropdown';

const {
  isPresent
} = Ember;

export default Ember.Component.extend(ManualDropdown, {
  isSearching: false,
  hasPerformedSearch: false,

  // Pass key/value pairs to add additional hardcoded options to the list.
  otherLocations: [],

  click() {
    this.$('input').select();
  },

  setInputValue: function() {
    this.set('inputValue', this.get('location'));
  }.observes('location'),

  initInputValue: function() {
    this.setInputValue();
  }.on('init'),

  initInput: function() {
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
  }.on('didInsertElement'),

  removeQueryInput: function() {
    this.$('input').off('keyUp');
  }.on('willDestroyElement'),

  updateFilter() {
    this.set('open', false);
    this.sendAction('submit');
  },

  sendSearchQuery(value) {
    const url = `${config.API_NAMESPACE}/locations`;

    this.set('location', value);

    ajax(url, {
      data: {query: value}
    }).then((response) => {
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