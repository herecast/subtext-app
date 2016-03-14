import Ember from 'ember';
import ManualDropdown from '../mixins/components/manual-dropdown';

const {
  set,
  get,
  inject
} = Ember;

export default Ember.Component.extend(ManualDropdown, {
  api: inject.service('api'),
  venues: [],

  init() {
    this._super(...arguments);
    set(this, 'hasPerformedSearch', false);
  },

  initInput: function() {
    this.$('input').keyup(() => {
      const name = this.get('venueName');

      if (Ember.isPresent(name) && name.length > 2) {
        this.setProperties({
          hasPerformedSearch: true,
          isSearching: true,
          open: true
        });

        Ember.run.debounce(this, this.sendSearchQuery, name, 300);
      }
    });
  }.on('didInsertElement'),

  removeQueryInput: function() {
    this.$('input').off('keyUp');
  }.on('willDestroyElement'),

  sendSearchQuery(value) {
    const api = get(this, 'api');

    api.getVenues(value).then((response) => {
      this.setProperties({
        venues: response.venues,
        open: true,
        isSearching: false
      });
    });
  },

  actions: {
    setVenue(venue) {
      set(this, 'open', false);
      this.attrs.setVenue(venue);
    },

    addNewVenue() {
      set(this, 'open', false);
      this.attrs.addNewVenue();
    }
  }
});
