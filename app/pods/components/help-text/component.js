import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { run } from '@ember/runloop';

export default Component.extend({
  classNames: ['HelpText'],
  classNameBindings: ['smallIcon:small-icon', 'isWhite:white'],
  intercom: service(),
  tracking: service(),

  openingHelp: false,
  smallIcon: false,
  isWhite: false,

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
