import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'BizFeed-CreateButton',

  organization: null,

  showOptions: false,

  actions: {
    toggleShowOptions() {
      this.toggleProperty('showOptions');
    }
  }
});
