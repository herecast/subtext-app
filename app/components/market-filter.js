import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],

  otherLocations: [
    {name: 'Upper Valley', id: 0}
  ],

  actions: {
    submit() {
      const filterParams = this.getProperties(
        'query', 'location', 'locationId'
      );

      this.sendAction('updateFilter', filterParams);
    }
  }
});
