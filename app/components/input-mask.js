import Ember from 'ember';

export default Ember.TextField.extend({
  initializeMask: function() {
    var mask = this.get('mask');

    this.$().inputmask(mask, {
      placeholder: '_'
    });
  }.on('didInsertElement')

});
