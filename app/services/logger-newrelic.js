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

  logMessages(...messages) {
    const NREUM = get(this, 'NREUM');

    if (isPresent(NREUM)) {
      try {
        const errors = [];
        const strings = [];

        // In order to match the signature of console.error,
        // We need to support accepting one or many Errors, strings and arbitrary objects in any order
        // Therefore, we separate out the Errors and stringify anything else
        messages.forEach(item => {
          if (item instanceof Error) {
            errors.push(item);
          } else {
            strings.push(JSON.stringify(item));
          }
        });

        // Guarantee we have at least one "real" Error object.
        if (!errors.length) {
          errors.push(new Error());
        }

        // Add the messages to each Error and fire it to newrelic.
        // Add the error's own message to the end, so newrelic's ability to parse the stack trace doesn't break
        errors.forEach(error => {
          let errorMessages = [].concat(strings);
          errorMessages.push(error.message);
          error.message = errorMessages.join(' ');

          NREUM.noticeError(error);
        });
      } catch (err) {
        // Prevent infinite loop if NREUM call fails
        console.error(err);
      }
    }
  }
});
