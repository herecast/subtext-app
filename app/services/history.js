import Ember from 'ember';

export default Ember.Service.extend({
  routeName: null,

  setRouteName(name) {
    this.set('routeName', name);
  }
});
