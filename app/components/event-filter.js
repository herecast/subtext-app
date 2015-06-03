import Ember from 'ember';

export default Ember.Component.extend({
  tabName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  session: Ember.inject.service('session'),
  refreshParam: Ember.inject.service('refresh-param'),

  actions: {
    submit() {
      const filterParams = this.getProperties('category', 'query', 'location');

      filterParams.date_start = this.get('startDate');
      filterParams.date_end = this.get('stopDate');
      filterParams.r = this.get('refreshParam.time');

      this.sendAction('updateFilter', filterParams);
    }
  }
});
