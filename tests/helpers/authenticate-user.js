import { deprecate } from '@ember/application/deprecations';
import { isEmpty } from '@ember/utils';
//import { authenticateSession } from 'subtext-app/tests/helpers/ember-simple-auth';
import { authenticateSession } from 'ember-simple-auth/test-support';

export default function(server) {
  const args = Array.from(arguments);
  let user;

  if(args.length > 1) {
    user = args.pop();
    if(user === server) {
      deprecate("No need to pass \"server\" to authenticateUser()");

      user = undefined;
    }
  }

  if(isEmpty(user)) {
    user = server.create('current-user');
  }

  authenticateSession({
    email: user.email,
    token: "FCxUDexiJsyChbMPNSyy"
  });

  server.db.currentUsers.remove();
  server.db.currentUsers.insert(user.attrs);

  return user;
}
