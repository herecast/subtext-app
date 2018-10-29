import Component from '@ember/component';

export default Component.extend({
  showMenu: false,
  organization: null,

  actions: {
    toggleJobsMenu() {
      this.toggleProperty('showMenu');
    }
  }
});
