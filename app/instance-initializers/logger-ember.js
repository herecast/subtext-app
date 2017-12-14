import Ember from 'ember';

export function initialize(appInstance) {
  const logger = appInstance.lookup('service:logger');

  // Override Ember.Logger.log, etc to use our service instead (Ember's default uses the console)
  ['debug', 'log', 'info', 'warn', 'error'].forEach(logMethod => {
    Ember.Logger[logMethod] = logger[logMethod].bind(logger);
  });
}

export default {
  name: 'logger:ember',
  initialize
};
