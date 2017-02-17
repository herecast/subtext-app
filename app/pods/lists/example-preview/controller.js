import Ember from 'ember';

const { inject } = Ember;

export default Ember.Controller.extend({
  featureFlags: inject.service('feature-flags')
});
