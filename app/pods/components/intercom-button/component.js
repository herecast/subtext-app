import Ember from 'ember';

const {get, set, computed, inject} = Ember;

export default Ember.Component.extend({
  classNames: 'IntercomButton',
  classNameBindings : ['footerShowing:footer-nav-showing'],

  intercom: inject.service(),
  footerService: inject.service('footer'),

  footerShowing: computed('media.isMobile', 'footerService.hideFooter', function () {
    return get(this, 'media.isMobile') && ! get(this, 'footerService.hideFooter');
  }),

  intercomWindowOpen: false,

  init() {
    this._super(...arguments);

    const intercom = get(this, 'intercom');
    //callbacks from Intercom to change state of custom button if
    //intercom is opened through other means
    intercom.onShow(() => { set(this, 'intercomWindowOpen', true); });
    intercom.onHide(() => { set(this, 'intercomWindowOpen', false); });
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
