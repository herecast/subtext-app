import Ember from 'ember';
const { $, get, set, merge, on, RSVP } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Service.extend({
  modals:null,

  initService: on('init', function(){
    set(this, 'modals', a());
  }),

  addModalBodyClass() {
    $('body').addClass('modal-open');
  },

  removeModalBodyClass() {
    $('body').removeClass('modal-open');
  },

  showModal(componentName, context){
    var defer = RSVP.defer();

    context = context || {};

    get(this, 'modals').pushObject({
      componentName: componentName,
      context: context,
      defer: defer
    });

    this.addModalBodyClass();

    return defer.promise;
  },

  removeModal(modal) {
    get(this, 'modals').removeObject(modal);

    if(get(this, 'modals.length') < 1) {
      this.removeModalBodyClass();
    }
  },

  resolveModal(modal, results) {
    this.removeModal(modal);
    modal.defer.resolve(results);
  },

  rejectModal(modal, results) {
    this.removeModal(modal);
    modal.defer.reject(results);
  },

  clearModals() {
    set(this, 'modals', a());
    this.removeModalBodyClass();
  }

});
