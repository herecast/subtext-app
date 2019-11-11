import { get, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModalInstance from 'subtext-app/pods/components/modal-instance/component';

export default ModalInstance.extend({
  classNames: ['Modals-ConfirmBox'],

  model: null,

  emphasizeYes: readOnly('model.emphasizeYes'),

  yesColor: computed('emphasizeYes', function() {
    return get(this, 'emphasizeYes') ? 'primary' : 'light-gray';
  }),

  noColor: computed('emphasizeYes', function() {
    return get(this, 'emphasizeYes') ? 'light-gray' : 'primary';
  }),

  message: readOnly('model.message'),

  actions: {
    close() {
      this.close();
    },

    cancel() {
      this.close();
    },

    confirm() {
      if (get(this, 'model.onConfirm')) {
        get(this, 'model.onConfirm')();
      }
      
      this.close();
    }
  }
});
