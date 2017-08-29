import Ember from 'ember';

const {get, set, inject, run} = Ember;

export default Ember.Component.extend({
  classNames: ['HelpText'],
  intercom: inject.service(),
  tracking: inject.service(),

  openingHelp: false,

  click() {
    // Track click, open intercom and prevent user from spamming the button (which could crash intercom on iOS)
    if (!get(this, 'openingHelp')) {

      set(this, 'openingHelp', true);

      const tracking = get(this, 'tracking');
      const intercom = get(this, 'intercom');

      tracking.trackHelpTextClick();
      intercom.showMessenger();

      // Re-enable the button after 3 seconds
      run.later(() => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'openingHelp', false);
        }
      }, 3000);
    }
  }
});
