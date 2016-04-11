import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import ManualDropdown from '../mixins/components/manual-dropdown';

const {
  set,
  on
} = Ember;

export default Ember.Component.extend(ManualDropdown, {
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
    const url = `${config.API_NAMESPACE}/venues`;

    ajax(url, {
      data: {query: value}
    }).then((response) => {
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
