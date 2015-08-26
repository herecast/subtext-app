import Ember from 'ember';

export default Ember.Controller.extend({
  backgroundClass: function() {
    const currentController = this.controllerFor(this.get('currentPath'));
    let klass = '';
    if (Ember.isPresent(currentController) && currentController.get('secondaryBackground')) {
      klass += 'u-colorBgSecondary';
    }
    if (Ember.isPresent(currentController) && currentController.get('secondaryBackgroundMobile')) {
      klass += ' u-colorBgSecondary--mobile';
    }
    return klass;
  }.property('currentPath')
});
