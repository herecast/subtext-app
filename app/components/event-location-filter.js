import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  classNames: ['Dropdown', 'dropdown'],
  classNameBindings: ['open'],

  initInput: function() {
    const location = this.get('location');

    this.set('inputValue', location);

    this.$('input').keyup(() => {
      const value = this.get('inputValue');

      if (Ember.isPresent(value) && value.length > 2) {
        Ember.run.debounce(this, this.sendSearchQuery, value, 300);
      }
    });
  }.on('didInsertElement'),

  removeQueryInput: function() {
    this.$('input').off('keyUp');
  }.on('willDestroyElement'),

  setInput(value) {
    this.setProperties({
      inputValue: value,
      location: value
    });
  },

  sendSearchQuery(value) {
    const url = `${config.API_NAMESPACE}/events/venues`;

    ajax(url, {
      data: {query: value}
    }).then((response) => {
      this.setProperties({
        places: response.locations,
        open: true
      });
    });
  },

  actions: {
    setLocation(location) {
      this.setInput(location);
      this.set('open', false);
    }
  }
});
