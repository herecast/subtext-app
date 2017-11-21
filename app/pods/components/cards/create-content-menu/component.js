import Ember from 'ember';

export default Ember.Component.extend({
  showMenu: false,
  organization: null,

  actions: {
    toggleJobsMenu() {
      this.toggleProperty('showMenu');
    }
  }
});
