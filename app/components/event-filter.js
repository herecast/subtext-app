import Ember from 'ember';

export default Ember.Component.extend({
  tabName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  session: Ember.inject.service('session'),

  actions: {
    submit() {
      const filterParams = this.getProperties(
        'category', 'query', 'date_start', 'date_end', 'location'
      );

      this.sendAction('updateFilter', filterParams);
    }
  }
});
