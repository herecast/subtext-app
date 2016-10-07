import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import Ember from 'ember';

const { isEmpty } = Ember;

export default function(application, server, user) {
  if(isEmpty(user)) {
    user = server.create('user');
  }

  authenticateSession(application, {
    email: user.email,
    token: "FCxUDexiJsyChbMPNSyy"
  });

  server.db.currentUsers.remove();
  server.db.currentUsers.insert(user.attrs);

  return user;
}
