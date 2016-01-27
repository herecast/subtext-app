import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['DashboardSection'],
  classNameBindings: ['isCollapsed'],
  isCollapsed: false,
  headerText: "",
  actions: {
    toggleCollapsed: function() {
      this.toggleProperty('isCollapsed');
    }
  }
});