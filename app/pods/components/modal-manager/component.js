import Ember from 'ember';
const { computed, get, inject } = Ember; // jshint ignore:line

export default Ember.Component.extend({
  modalService: inject.service('modals'),

  modals: computed.alias('modalService.modals'),

  hasModal: computed.notEmpty('modals'),

  actions: {
    closeModalResolve(modal, result) {
      get(this, 'modalService').resolveModal(modal, result);
    },

    closeModalReject(modal, result) {
      get(this, 'modalService').rejectModal(modal, result);
    }
  }
});
