import Ember from 'ember';
import ManualDropdown from '../mixins/components/manual-dropdown';

const { get, inject, observer, on } = Ember;

export default Ember.Component.extend(ManualDropdown, {
  api: inject.service('api'),
  isSearching: false,
  hasPerformedSearch: false,

  click() {
    this.$('input').select();
  },

  setInputValue: observer('organization', function() {
    this.set('inputValue', this.get('organization'));
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

    this.set('organization', value);

    api.getOrganizations(value).then((response) => {
      this.setProperties({
        organizations: response.organizations.mapBy('name'),
        open: true,
        isSearching: false
      });
    });
  },

  actions: {
    setOrganization(organization) {
      this.setProperties({
        organization: organization,
        inputValue: organization,
        open: false
      });

      // This prevents the input from being selected when a user chooses a
      // organization from the dropdown menu.
      Ember.run.later(() => {
        this.updateFilter();
      }, 10);
    },

    customSearch() {
      Ember.run.later(() => {
        this.$('input').focus();
      }, 50);

      this.send('setOrganization', '');
    }
  }
});
