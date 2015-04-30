import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  // TODO: Use an API endpoint to populate this field as the user types
  places: function() {
    return [
      'Upper Valley', 'Burlington, VT', '123 Test Street'
    ];
  }.property(),

  actions: {
    setLocation(location) {
      this.set('location', location);
    }
  }
});
