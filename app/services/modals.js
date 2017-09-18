import Ember from 'ember';
const { $, get, set, on, RSVP, inject } = Ember;
const a = Ember.A;

export default Ember.Service.extend({
  modals:null,
  serviceIsActive: true,
  fastboot: inject.service(),
  isFastboot() {
    return get(this, 'fastboot.isFastBoot');
  },
  _fbAddedClass: false,

  initService: on('init', function(){
    set(this, 'modals', a());
  }),

  addModalBodyClass() {
    if(!this.isFastboot()) {

      $('body').addClass('modal-open');

    } else {
      if(! get(this, '_fbAddedClass')) {
        let container = Ember.getOwner ? Ember.getOwner(this) : this.container;
        let renderer = container.lookup('renderer:-dom');
        let domForAppWithGlimmer2 = container.lookup('service:-document');

        let document = null;

        if (renderer && renderer._dom) {
          // Regular Fastboot
          document = Ember.get(renderer, '_dom.document');
        } else if (domForAppWithGlimmer2) {
          // Glimmer 2 has a different renderer
          document = domForAppWithGlimmer2;
        }

        if (document) {
          let script = document.createElement('script');
          script.setAttribute('type', 'text/javascript');
          script.appendChild(document.createTextNode('document.body.classList.add("modal-open");'));
          // Add script to document to add the class from the browser at runtime.
          document.body.appendChild(script);
          set(this, '_fbAddedClass', true);
        }
      }
    }
  },

  removeModalBodyClass() {
    /**
     * @TODO reimplement in fastboot compatible way
     * @FASTBOOT_BROKEN
     */
    if(!this.isFastboot()) {
      $('body').removeClass('modal-open');
    }
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
  },

  pauseService() {
    set(this, 'serviceIsActive', false);
  },

  resumeService() {
    set(this, 'serviceIsActive', true);
  }

});
