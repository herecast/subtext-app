import Ember from 'ember';
import Devise from 'ember-simple-auth/authenticators/devise';

const { isEmpty } = Ember;
const { Promise } = Ember.RSVP;

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
