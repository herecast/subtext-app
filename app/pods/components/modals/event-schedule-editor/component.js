import { get, computed } from '@ember/object';
import ModalBase from 'subtext-ui/pods/components/modal-instance/component';
import ScheduleValidations from 'subtext-ui/validations/schedule';

export default ModalBase.extend({
  validations: ScheduleValidations,
  isRepeating: computed('model.repeats', function() {
    const repeats = get(this, 'model.repeats');

    return repeats && repeats !== 'once';
  }),

  actions: {
    save(cs){
      cs.validate();
      if(cs.get('isValid')) {
        cs.execute();

        this.ok(cs);
      }
    }
  }
});
