import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import Ember from 'ember';

const { isEmpty } = Ember;

export default function(application) {
  const args = Array.from(arguments);
  let user;

  if(args.length > 1) {
    user = args.pop();
    if(user === server) {
      Ember.deprecate("No need to pass \"server\" to authenticateUser()");

      user = undefined;
    }
  }

  if(isEmpty(user)) {
    user = server.create('current-user');
  }

  authenticateSession(application, {
    email: user.email,
    token: "FCxUDexiJsyChbMPNSyy"
  });

  server.db.currentUsers.remove();
  server.db.currentUsers.insert(user.attrs);

  return user;
}
