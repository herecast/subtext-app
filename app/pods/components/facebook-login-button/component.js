/* global FB */

import Ember from 'ember';

const {get, set, isPresent, inject, RSVP} = Ember;

export default Ember.Component.extend({
  tracking: inject.service(),
  session: inject.service(),
  api: inject.service(),
  notify: inject.service('notification-messages'),
  userLocation: inject.service(),

  permissions: 'email,public_profile',

  tryAgain: false,

  loginWithFacebook() {
    this.trackSignInClick();

    let options = {
      scope: get(this, 'permissions')
    };

    const tryAgain = get(this, 'tryAgain');
    if (isPresent(tryAgain)) {
      options.auth_type = 'rerequest';
    }

    set(this, 'tryAgain', false);

    return new RSVP.Promise(resolve => {
      FB.login(response => {
        resolve(response);
        this._handleFacebookResponse(response);
      }, options);
    });
  },

  trackSignInClick() {
    get(this, 'tracking').push({
      event: 'sign-in-submit-click',
      sign_in_type: 'facebook'
    });
  },

  signInWithOauth(oauthData) {
    return new RSVP.Promise((resolve, reject) => {

      const registerUser = (locationId) => {
        oauthData.location_id = locationId;

        get(this, 'api').signInWithOauth(oauthData)
          .then(response => {
            if (!get(this, 'isDestroyed')) {
              return get(this, 'session').authenticate('authenticator:restore', response)
                .then(() => {
                  const afterAuthenticate = get(this, 'afterAuthenticate');
                  if (afterAuthenticate) {
                    afterAuthenticate();
                  }
                  get(this, 'notify').notifyLoginSuccess();
                  resolve();
                }).catch(error => {
                  let errorMessage = ('error' in error) ? error.error : 'Error: Unable to sign in.';
                  get(this, 'notify').error(errorMessage);
                  reject();
                });
            }
          }).catch(() => {
            const errorMessage = 'All requested permissions are required to login. Please try again.';
            get(this, 'notify').error(`Error: ${errorMessage}`);
            set(this, 'tryAgain', true);
            reject();
          }
        );
      };

      // Register the user after we load the location
      // If location does not load, register user with default location
      get(this, 'userLocation.location').then(location => {
        registerUser(get(location, 'id'));
      }).catch(() => registerUser(null));
    });
  },

  _handleFacebookResponse(response) {
    if (!get(this, 'isDestroyed') && 'status' in response && response.status === 'connected') {
      return this.signInWithOauth(response.authResponse);
    }
  },

  actions: {
    loginWithFacebook() {
      return this.loginWithFacebook();
    }
  }
});
