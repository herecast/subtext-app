import Ember from 'ember';

export default Ember.Component.extend({
  step1Complete: Ember.computed.equal('step1State', 'complete'),
  step2Complete: Ember.computed.equal('step2State', 'complete'),
  step3Complete: Ember.computed.equal('step3State', 'complete'),
});
