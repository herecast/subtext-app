import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: ['ContentFormSteps', 'col-sm-8', 'col-sm-offset-2'],
  step1Complete: equal('step1State', 'complete'),
  step2Complete: equal('step2State', 'complete'),
  step3Complete: equal('step3State', 'complete'),
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
