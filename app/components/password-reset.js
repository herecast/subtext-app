import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { observer, computed } = Ember;

export default Ember.Component.extend(TrackEvent, {
  classNames: ['PasswordReset'],
  showErrors: false,

  isValid: computed('password', 'passwordConfirmation', function() {
    return Ember.isPresent(this.get('password')) && Ember.isPresent(this.get('passwordConfirmation')) && (this.get('password') === this.get('passwordConfirmation'));
  }),

  hideErrors: observer('isValid', function() {
    if (this.get('isValid')) {
      this.set('showErrors', false);
    }
  }),

  actions: {
    resetPassword() {
      if (this.get('isValid')) {
        const url = `${config.API_NAMESPACE}/current_user`;
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

        ajax(url, {
          type: 'PUT',
          data: data,
        }).then(() => {
          this.attrs.onSubmit();
        });
      } else {
        this.toggleProperty('showErrors');
      }
    }
  }
});
