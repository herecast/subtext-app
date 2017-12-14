import Ember from 'ember';

/**
 * Generic service to handle logging.
 * Sends logging events to one or more loggers, based on what was configured using initializers.
 */
export default Ember.Service.extend(Ember.Evented, {

  _logMessages(severity, messages) {
    this.trigger('logMessages', severity, messages);
  },

  error(...messages) {
    this._logMessages('error', messages);
  },

  warn(...messages) {
    this._logMessages('warn', messages);
  },

  log(...messages) {
    this._logMessages('log', messages);
  },

  info(...messages) {
    this._logMessages('info', messages);
  },

  debug(...messages) {
    this._logMessages('debug', messages);
  }

});
