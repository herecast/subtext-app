import Ember from 'ember';

export default Ember.Component.extend({
  tabName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  session: Ember.inject.service('session'),

  actions: {
    submit() {
      const filterParams = this.getProperties('category', 'query', 'location');

      filterParams.date_start = this.get('startDate');
      filterParams.date_end = this.get('stopDate');

      this.sendAction('updateFilter', filterParams);
    }
  }
});
