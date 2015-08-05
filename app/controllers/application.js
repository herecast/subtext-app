import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  backgroundClass: function() {
    const currentController = this.controllerFor(this.get('currentPath'));
    if (Ember.isPresent(currentController) && currentController.get('secondaryBackground')) {
      return 'u-colorBgSecondary';
    } else {
      return '';
    }
  }.property('currentPath')
});
