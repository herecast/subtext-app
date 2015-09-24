import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import ManualDropdown from '../mixins/components/manual-dropdown';

export default Ember.Component.extend(ManualDropdown, {
  venues: [],

  initInput: function() {
    this.$('input').keyup(() => {
      const name = this.get('venueName');

      if (Ember.isPresent(name) && name.length > 2) {
        Ember.run.debounce(this, this.sendSearchQuery, name, 300);
      }
    });
  }.on('didInsertElement'),

  removeQueryInput: function() {
    this.$('input').off('keyUp');
  }.on('willDestroyElement'),

  sendSearchQuery(value) {
    const url = `${config.API_NAMESPACE}/venues`;

    ajax(url, {
      data: {query: value}
    }).then((response) => {
      if (response.venues.length >= 1) {
        this.setProperties({
          venues: response.venues,
          open: true
        });
      } else {
        this.set('open', false);
      }
    });
  },

  actions: {
    setVenue(venue) {
      this.sendAction('setVenue', venue);
    }
  }
});
