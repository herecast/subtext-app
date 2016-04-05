import Ember from 'ember';

const { on } = Ember;

export default Ember.TextField.extend({
  initializeMask: on('didInsertElement', function() {
    var mask = this.get('mask');

    this.$().inputmask(mask, {
      placeholder: '_'
    });
  })

});
