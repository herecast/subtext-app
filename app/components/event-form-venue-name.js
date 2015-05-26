import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  classNames: ['dropdown'],
  classNameBindings: ['open'],

  venues: [],

  initInput: function() {
    this.$('input').keyup(() => {
      const name = this.get('venueName');

      if (Ember.isPresent(name) && name.length > 2) {
        Ember.run.debounce(this, this.sendSearchQuery, name, 300);
      }
    });
  }.on('didInsertElement'),

  // Since we're manually toggling the dropdown when results are found, we need
  // to manualy manage the click binding state. Otherwise the menu would not
  // close when a user clicks outside of it.
  initDropdownToggle: function() {
    if (this.get('open')) {
      Ember.$('html').on('click.form-venue', () => {
        this.set('open', false);
      });
    } else {
      Ember.$('html').off('click.form-venue');
    }
  }.observes('open'),

  removeQueryInput: function() {
    this.$('input').off('keyUp');
    Ember.$('html').off('click.form-venue');
  }.on('willDestroyElement'),

  sendSearchQuery(value) {
    const url = `/${config.API_NAMESPACE}/venues`;

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
