import { inject as service } from '@ember/service';
import { alias, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  modalService: service('modals'),

  modals: alias('modalService.modals'),

  hasModal: notEmpty('modals'),

  actions: {
    closeModalResolve(modal, result) {
      get(this, 'modalService').resolveModal(modal, result);
    },

    closeModalReject(modal, result) {
      get(this, 'modalService').rejectModal(modal, result);
    }
  }
});
