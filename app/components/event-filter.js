import Ember from 'ember';

export default Ember.Component.extend({
  tabName: 'nav',
  classNames: ['navbar navbar-default'],

  actions: {
    submit() {
      const filterParams = this.getProperties(
        'category', 'startDate', 'stopDate'
      );

      this.sendAction('updateFilter', filterParams);
    }
  }
});
