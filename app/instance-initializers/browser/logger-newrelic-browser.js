/* global NREUM */

import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const {
  set,
  isPresent
} = Ember;

export function initialize(appInstance) {
  const {NEW_RELIC_BROWSER_APP_ID, NEW_RELIC_BROWSER_LICENSE_KEY} = config;

  if (typeof NREUM !== 'undefined' && isPresent(NEW_RELIC_BROWSER_APP_ID) && isPresent(NEW_RELIC_BROWSER_LICENSE_KEY)) {
    const logger = appInstance.lookup('service:logger');
    const loggerNewRelic = appInstance.lookup('service:logger-newrelic');

    // Set new relic config
    NREUM.info = {
      applicationID: NEW_RELIC_BROWSER_APP_ID,
      licenseKey: NEW_RELIC_BROWSER_LICENSE_KEY,
      beacon: 'bam.nr-data.net',
      errorBeacon: 'bam.nr-data.net',
      sa: 1
    };

    // Set new relic's global as a local variable used in the logger-newrelic service
    set(loggerNewRelic, 'NREUM', NREUM);

    // Send "error" level log messages to new relic
    logger.on('logMessages', (severity, messages) => {
      if (severity === 'error') {
        loggerNewRelic.logMessages(messages);
      }
    });
  }
}

export default {
  name: 'logger:newrelic-browser',
  initialize
};
