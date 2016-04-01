import CustomSession from '../lib/custom-session';
import CustomDeviseAuth from '../lib/devise-authorizer';
import CustomDeviseAuthenticator from '../lib/confirmation-authenticator';
import config from '../config/environment';

export function initialize(container) {
  container.register('session:custom-session', CustomSession);
  container.register('subtext-ui:devise-authorizer', CustomDeviseAuth);
  container.register('subtext-ui:confirmation-authenticator', CustomDeviseAuthenticator);

  config['simple-auth'] = {
    session: 'session:custom-session',
    authorizer: 'subtext-ui:devise-authorizer'
  };
}

export default {
  name: 'custom-session',
  before: 'simple-auth',

  initialize: initialize
};
