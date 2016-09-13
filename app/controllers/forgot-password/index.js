import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['returnUrl'],
  returnUrl: null,
  secondaryBackground: true
});
