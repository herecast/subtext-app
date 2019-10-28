import { readOnly } from '@ember/object/computed';
import ModalInstance from 'subtext-app/pods/components/modal-instance/component';

export default ModalInstance.extend({
  classNames: ['Modals-SimpleMessage'],
  
  model: null,

  message: readOnly('model.message'),

  actions: {
    close() {
      this.close();
    }
  }
});
