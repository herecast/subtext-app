import Ember from 'ember';

export default Ember.Mixin.create({
  history: Ember.inject.service('history'),
  routeModel: null,

  actions: {
    didTransition: function() {
      const routeName = this.get('historyRouteName') || this.routeName;
      this.get('history').setRouteName(routeName);
      this.get('history').setRouteModel(this.get('historyRouteModel'));
      return true;
    }
  }
});
