import Ember from 'ember';

const { get, computed, inject } = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),
  isFastBoot: computed.readOnly('fastboot.isFastBoot'),

  actions: {
    didTransition: function() {
      if(!get(this, 'isFastBoot')) {
        Ember.$(window).scrollTop(0);
      }
      return true; // Bubble the didTransition event
    }
  }
});
