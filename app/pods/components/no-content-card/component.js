import Ember from 'ember';

const {get, inject} = Ember;

export default Ember.Component.extend({
  "data-test-component": 'no-content-card',
  floatingActionButton: inject.service(),

  actions: {
    showJobsTray() {
      get(this, 'floatingActionButton').expand();
    }
  }
});
