import Ember from 'ember';

export default Ember.Mixin.create({
  history: Ember.inject.service('history'),

  actions: {
    didTransition: function() {
      this.get('history').setRouteName(this.routeName);

      return true;
    }
  }
});
