import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],

  actions: {
    submit() {
      const filterParams = this.getProperties('query');

      this.sendAction('updateFilter', filterParams);
    }
  }
});
