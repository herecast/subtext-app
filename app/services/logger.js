import { isNone } from '@ember/utils';
import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { get } from '@ember/object';

/**
 * Generic service to handle logging.
 * Sends logging events to one or more loggers, based on what was configured using initializers.
 */
export default Service.extend(Evented, {

  init() {
    this._super();
    this._initializeEmberLoggers();
  },

  _initializeEmberLoggers() {
    // Note: using `.bind` here instead of a fat-arrow closure to avoid any risk of a memory leak
    /*
    Ember.onerror = this._handleEmberError.bind(this);
    Ember.RSVP.on('error', this._handleEmberError.bind(this));
    ['debug', 'log', 'info', 'warn', 'error'].forEach(logMethod => {
      Ember.Logger[logMethod] = this[logMethod].bind(this);
    });
    */
  },

  _handleEmberError(error) {
    if (this._mustIgnoreError(error)) {
      return;
    }

    this.error(error || new Error());
  },

  /**
   * Ember 2.X seems to not catch `TransitionAborted` errors caused by regular redirects.
   * We don't want these errors to show up in NewRelic so we have to filter them ourselves.
   * Once the issue https://github.com/emberjs/ember.js/issues/12505 is resolved we can remove this ignored error.
   *
   * @param error
   * @returns {boolean}
   * @private
   */
  _mustIgnoreError(error) {
    if (isNone(error)) {
      return false;
    }

    const errorName = get(error, 'name');
    const errorStatus = get(error, 'status') || 0;

    return errorName === 'TransitionAborted' && (errorStatus < 500);
  },

  _logMessages(severity, messages) {
    if (this.has('logMessages')) {
      this.trigger('logMessages', severity, messages);
    } else {
      if (severity === 'error') {
        //eslint-disable-next-line no-console
        console.error(...messages);
      }
    }
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
