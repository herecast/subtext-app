import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, inject } = Ember;

export default Ember.Component.extend(TrackEvent, {
  api: inject.service('api'),
  classNames: ['PasswordReset'],
  showErrors: false,

  isValid: function() {
    return Ember.isPresent(this.get('password')) && Ember.isPresent(this.get('passwordConfirmation')) && (this.get('password') === this.get('passwordConfirmation'));
  }.property('password', 'passwordConfirmation'),

  hideErrors: function() {
    if (this.get('isValid')) {
      this.set('showErrors', false);
    }
  }.observes('isValid'),

  actions: {
    resetPassword() {
      if (this.get('isValid')) {
        const api = get(this, 'api');
        const data = {
          current_user: {
            user_id: this.get('userId'),
            password: this.get('password'),
            password_confirmation: this.get('passwordConfirmation')
          }
        };

        this.trackEvent('selectNavControl', {
          navControlGroup: 'Profile Feature Submit',
          navControl: 'Submit Password Change'
        });

        api.updateCurrentUserPassword(data).then(() => {
          this.attrs.onSubmit();
        });
      } else {
        this.toggleProperty('showErrors');
      }
    }
  }
});
