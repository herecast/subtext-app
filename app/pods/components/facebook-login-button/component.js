import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import RSVP from 'rsvp';
import SocialPreloaded from 'subtext-app/mixins/components/social-preloaded';

export default Component.extend(SocialPreloaded, {
  tracking: service(),
  session: service(),
  api: service(),
  notify: service('notification-messages'),
  userLocation: service(),
  facebook: service(),

  permissions: 'email,public_profile',
  startMessage: 'Continue with Facebook',
  pendingMessage: 'Signing in...',
  isDisabled: false,
  newHandle: null,
  isRegistering: notEmpty('newHandle'),

  tryAgain: false,
  socialPreloadedOnDidInsert: true,

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

    return new RSVP.Promise((resolve) => {
      get(this, 'facebook').login(response => {
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

        if (get(this, 'newHandle')) {
          oauthData.handle = get(this, 'newHandle');
        }

        get(this, 'api').signInWithOauth(oauthData)
          .then(response => {
            if (!get(this, 'isDestroyed')) {
              return get(this, 'session').authenticate('authenticator:restore', response)
                .then(() => {
                  get(this, 'notify').notifyLoginSuccess();
                  if (get(this, 'isRegistering') && get(this, 'afterRegister')) {
                    get(this, 'afterRegister')();
                  }
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
      get(this, 'userLocation.userLocation').then(location => {
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
