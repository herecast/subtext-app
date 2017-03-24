import Ember from 'ember';
import ManualDropdown from '../mixins/components/manual-dropdown';

const {
  set,
  on,
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

  initInput: on('didInsertElement', function() {
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
  }),

  removeQueryInput: on('willDestroyElement', function() {
    this.$('input').off('keyUp');
  }),

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
      const setVenue = get(this, 'setVenue');
      if (setVenue) {
        setVenue(venue);
      }
    },

    addNewVenue() {
      set(this, 'open', false);
      const addNewVenue = get(this, 'addNewVenue');
      if(addNewVenue) {
        addNewVenue();
      }
    }
  }
});
