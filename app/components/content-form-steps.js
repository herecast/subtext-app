import Ember from 'ember';

const {
  get,
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['ContentFormSteps', 'col-sm-8', 'col-sm-offset-2'],
  step1Complete: computed.equal('step1State', 'complete'),
  step2Complete: computed.equal('step2State', 'complete'),
  step3Complete: computed.equal('step3State', 'complete'),
  type: '',

  formattedType: computed('type', function() {
    if (get(this, 'type') === 'market') {
      return 'listing';
    } else {
      return get(this, 'type');
    }
  }),

  stepCountTypeClass: computed('type', function() {
    const formattedType = get(this, 'type').toLowerCase();

    return `ContentFormSteps-stepCount--${formattedType}`;
  })
});
