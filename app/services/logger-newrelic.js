import Ember from 'ember';

const {get, isPresent} = Ember;

/**
 * Logger implementation using New Relic
 * Initialized using a browser-only instance initializer since it does not run in fastboot
 *
 * @see https://docs.newrelic.com/docs/browser/new-relic-browser/getting-started/introduction-new-relic-browser
 */
export default Ember.Service.extend({
  NREUM: null, // this is New Relic's global, assigned here in an instance initializer

  logMessages(messages) {
    const NREUM = get(this, 'NREUM');
    if (isPresent(NREUM)) {
      try {
        NREUM.noticeError(messages.length === 1 ? messages[0] : messages);
      } catch (err) {
        // Prevent infinite loop if NREUM call fails
        console.error(err);
      }
    }
  }
});
