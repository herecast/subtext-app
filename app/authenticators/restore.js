import { Promise } from 'rsvp';
import { isEmpty } from '@ember/utils';
import Devise from 'ember-simple-auth/authenticators/devise';

export default Devise.extend({

  authenticate(data) {
    if( !isEmpty(data.email) && !isEmpty(data.token) ) {
      const sessionData = {
        email: data.email,
        token: data.token
      };
      return this.restore(sessionData);
    } else {
      return Promise.reject();
    }
  }
});
