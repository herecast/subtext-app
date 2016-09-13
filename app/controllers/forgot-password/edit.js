import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,
  return_url: null,
  queryParams: ['return_url']
});
