import Ember from 'ember';

const {get, set, inject} = Ember;

export default Ember.Component.extend({
  classNames: 'IntercomButton',

  intercom: inject.service(),

  intercomWindowOpen: false,

  init() {//NOTE @todo If this is initiated multiple times, need to deal with set on destroyed objects...depends on omnibox implementation
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
