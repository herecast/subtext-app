import Ember from 'ember';

const { RSVP, inject, get, set, isEmpty } = Ember;

export default Ember.Mixin.create({
  api: inject.service(),
  session: inject.service(),

  // Note: set this on the inheriting classes
  silentRegistrationObject: null,

  signin(data) {
    set(this, 'session.skipRedirect', true);
    set(this, 'session.transitionTo', 'none');

    if ( !isEmpty(data.token) && !isEmpty(data.email)) {
      return this.get('session').authenticate('authenticator:restore', data);
    } else {
      return this.get('session').authenticate('authenticator:application', data.email, data.password);
    }
  },

  silentRegisterIfNeeded() {
    return new RSVP.Promise((resolve, reject) => {
      if (! get(this, 'session.isAuthenticated')) {
        const silentRegistrationObject = get(this, 'silentRegistrationObject');

        if (silentRegistrationObject) {
          get(this, 'api').registerFromSubscription({
            registration: silentRegistrationObject
          }).then(
            data => { resolve(this.signin(data)); },
            error => reject(error)
          );
        } else {
          reject('Not registered');
        }
      } else {
        resolve(get(this, 'session.currentUser'));
      }
    });
  }
});
