import Ember from 'ember';

const {get, set, inject, run} = Ember;

export default Ember.Component.extend({
  classNames: 'IntercomButton',
  classNameBindings : ['footerShowing:footer-nav-showing'],

  footerShowing: false,
  intercomWindowOpen: false,

  intercom: inject.service(),

  checkBottom: null, // cancellable run loop invocation

  didInsertElement() {
    set(this, 'footerShowing', this._isFooterShowing());

    Ember.$(window).on('scroll.intercomButton', () => {
      let checkBottom = run.debounce(this, () => {
        set(this, 'footerShowing', this._isFooterShowing());
      }, 350);

      set(this, 'checkBottom', checkBottom);
    });

    const intercom = get(this, 'intercom');
    //callbacks from Intercom to change state of custom button if
    //intercom is opened through other means
    intercom.onShow( () => {set(this, 'intercomWindowOpen', true);} );
    intercom.onHide( () => {set(this, 'intercomWindowOpen', false);} );
  },

  willDestroyElement() {
    this._super(...arguments);

    Ember.$(window).off('scroll.intercomButton');
    run.cancel( get(this, 'checkBottom') );
  },

  _isFooterShowing() {
    const isMobile = get(this, 'media.isMobile');
    // Future iterations should move footer state to a service
    // Then remove fragile jquery hook
    const footerNav = Ember.$('nav.FooterNav');

     return isMobile && footerNav.length > 0 && !footerNav.hasClass('is-hidden');
  },

  actions: {
    toggleIntercomWindow() {
      const intercom = get(this, 'intercom');
      const intercomWindowOpen = get(this, 'intercomWindowOpen');

      if (intercomWindowOpen) {
        intercom.hideMessenger();
      } else {
        intercom.showMessenger();
      }
    }
  }
});
