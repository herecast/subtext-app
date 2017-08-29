import Ember from 'ember';

const {get, inject} = Ember;

export default Ember.Component.extend({
  classNames: ['JobsNavigation'],
  tracking: inject.service(),

  actions: {
    selectedMenuItem(job) {
      get(this, 'tracking').trackUGCJobClick(job);
    }
  }
});
