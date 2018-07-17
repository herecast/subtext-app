import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'BloggerIntro-Bullets',

  totalSteps: null,
  currentStep: null,

  bullets: computed('totalSteps', function() {
    const totalSteps = get(this, 'totalSteps');
    let bullets = [];

    if (totalSteps) {
      for (var i=0; i<totalSteps; i++) {
        bullets[i] = {step: i+1};
      }
    }
    
    return bullets;
  })

});
