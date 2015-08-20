import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ContentFormSteps', 'col-sm-8', 'col-sm-offset-2'],
  step1Complete: Ember.computed.equal('step1State', 'complete'),
  step2Complete: Ember.computed.equal('step2State', 'complete'),
  step3Complete: Ember.computed.equal('step3State', 'complete'),
  type: '',

  stepCountTypeClass: function() {
    const formattedType = this.get('type').toLowerCase();
    return `ContentFormSteps-stepCount--${formattedType}`;
  }.property('type')
});
