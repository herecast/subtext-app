import Ember from 'ember';
import ManualDropdown from '../mixins/components/manual-dropdown';

export default Ember.Component.extend(ManualDropdown, {
  updateFilter() {
    this.set('open', false);
    this.sendAction('submit');
  },

  setInputValue: function() {
    this.set('inputValue', this.get('location'));
  }.observes('location'),

  initInputValue: function() {
    this.setInputValue();
  }.on('init'),

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
        this.updateFilter();
      }, 10);
    }
  }
});
