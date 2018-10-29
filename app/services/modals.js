import { getOwner } from '@ember/application';
import Service, { inject as service } from '@ember/service';
import { A as a } from '@ember/array';
import $ from 'jquery';
import { set, get } from '@ember/object';
import { on } from '@ember/object/evented';
import RSVP from 'rsvp';

export default Service.extend({
  modals: null,
  serviceIsActive: true,
  fastboot: service(),
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
        let container = getOwner ? getOwner(this) : this.container;
        let renderer = container.lookup('renderer:-dom');
        let domForAppWithGlimmer2 = container.lookup('service:-document');

        let document = null;

        if (renderer && renderer._dom) {
          // Regular Fastboot
          document = get(renderer, '_dom.document');
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
    const modal = this.createModal(componentName, context);
    return modal.defer.promise;
  },

  createModal(componentName, context) {
    var defer = RSVP.defer();

    context = context || {};

    const modal = {
      componentName: componentName,
      context: context,
      defer: defer
    };

    get(this, 'modals').pushObject(modal);

    this.addModalBodyClass();

    return modal;
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
    modal.defer.promise.catch((e) => {
      // Silence non-errors from bubbling up to RSVP.onerror
      // These are not actually errors, but simply an inverse of
      // the preferred modal action. If it matters, it should be
      // caught in the calling code.
      if (typeof e !== "undefined") {
        throw e;
      }
    });
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
