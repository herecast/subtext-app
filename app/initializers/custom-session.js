import CustomSession from '../lib/custom-session';
import config from '../config/environment';

export function initialize(container) {
  container.register('session:custom-session', CustomSession);

  config['simple-auth'] = {
    session: 'session:custom-session',
    authorizer: 'simple-auth-authorizer:devise'
  };
}

export default {
  name: 'custom-session',
  before: 'simple-auth',

  initialize: initialize
};
