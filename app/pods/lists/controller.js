import Ember from 'ember';

const { inject } = Ember;

export default Ember.Controller.extend({
  features: inject.service('feature-flags')
});
