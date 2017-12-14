import Ember from 'ember';

const {get} = Ember;

export function initialize(appInstance) {
  const logger = appInstance.lookup('service:logger');

  const handleError = (error) => {
    if (mustIgnoreError(error)) {
      return;
    }

    logger.error(error || new Error());
  };

  Ember.onerror = handleError;
  Ember.RSVP.on('error', handleError);
}

function mustIgnoreError(error) {
  // Ember 2.X seems to not catch `TransitionAborted` errors caused by regular redirects.
  // We don't want these errors to show up in NewRelic so we have to filter them ourselves.
  // Once the issue https://github.com/emberjs/ember.js/issues/12505 is resolved we can remove this ignored error.
  if (Ember.isNone(error)) {
    return false;
  }

  const errorName = get(error, 'name');
  const errorStatus = get(error, 'status') || 0;

  return errorName === 'TransitionAborted' && (errorStatus < 500);
}

export default {
  name: 'logger:onerror',
  initialize
};
