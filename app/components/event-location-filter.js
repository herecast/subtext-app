import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  classNames: ['dropdown'],
  classNameBindings: ['open'],

  inputValue: Ember.computed.oneWay('location'),

  click() {
    this.$('input').select();
  },

  initInput: function() {
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

  sendSearchQuery(value) {
    const url = `/${config.API_NAMESPACE}/locations`;

    this.set('location', value);

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
      this.setProperties({
        location: location,
        inputValue: location,
        open: false
      });

      // This prevents the input from being selected when a user chooses a
      // location from the dropdown menu.
      Ember.run.later(() => {
        this.$('input').blur();
      }, 10);
    }
  }
});
