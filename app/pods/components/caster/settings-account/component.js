import { get, set, computed, setProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import Validation from 'subtext-app/mixins/components/validation';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend(Validation, {
  classNames: ['Caster-SettingsAccount'],

  api: service(),
  notifications: service('notification-messages'),

  caster: null,
  emailIsPublic: alias('caster.emailIsPublic'),

  wantsToChangePassword: false,
  isSavingPassword: false,

  wantsToChangeEmail: false,
  isSavingEmail: false,

  isCheckingEmail: false,

  wantsToChangeHandle: false,
  isSavingHandle: false,

  init() {
    this._super(...arguments);
    this._resetProperties();
  },

  _resetProperties() {
    setProperties(this, {
      newEmail: null,
      newEmailIsUnique: false,
      newPassword: null,
      newPasswordConfirmation: null,
      currentPassword: null,
      newHandle: '',
      newHandleIsUnique: false
    });
  },

  _checkCurrentPassword() {
    if (get(this, 'hasCurrentPassword')) {
      return new Promise((resolve, reject) => {
        const casterId = get(this, 'caster.id');
        const currentPassword = get(this, 'currentPassword');

        get(this, 'api').checkCurrentPassword(casterId, currentPassword)
        .then(() => {
          resolve();
        })
        .catch(() => {
          get(this, 'notifications').error('Invalid Password');
          set(this, 'currentPassword', null);
          reject();
        });
      });
    }

    return Promise.reject();
  },

  hasNewPassword: computed('newPassword', function() {
    const newPassword = get(this, 'newPassword') || null;

    return isPresent(newPassword) && this.hasValidPassword(newPassword);
  }),

  hasNewPasswordConfirmation: computed('newPasswordConfirmation', function() {
    const newPasswordConfirmation = get(this, 'newPasswordConfirmation') || null;

    return isPresent(newPasswordConfirmation) && this.hasValidPassword(newPasswordConfirmation);
  }),

  newPasswordMatchesConfirmation: computed('newPassword', 'newPasswordConfirmation', function() {
    if (isPresent(get(this, 'newPassword')) && get(this, 'newPasswordConfirmation')) {
      return get(this, 'newPassword') === get(this, 'newPasswordConfirmation');
    }

    return false;
  }),

  hasCurrentPassword: computed('currentPassword', function() {
    const currentPassword = get(this, 'currentPassword') || null;

    return isPresent(currentPassword) && this.hasValidPassword(currentPassword);
  }),

  saveHandleDisabled: computed('hasCurrentPassword', 'newHandleIsUnique', function() {
    return !(get(this, 'hasCurrentPassword') && get(this, 'newHandleIsUnique'));
  }),

  saveEmailDisabled: computed('hasCurrentPassword', 'newEmailIsUnique', function() {
    return !(get(this, 'hasCurrentPassword') && get(this, 'newEmailIsUnique'));
  }),

  savePasswordDisabled: computed('hasNewPassword', 'hasNewPasswordConfirmation', 'hasCurrentPassword', 'newPasswordMatchesConfirmation', function() {
    return !(get(this, 'hasNewPassword') && get(this, 'hasNewPasswordConfirmation') && get(this, 'hasCurrentPassword') && get(this, 'newPasswordMatchesConfirmation'));
  }),

  actions: {
    toggleHandleModal() {
      this.toggleProperty('wantsToChangeHandle');
      this._resetProperties();
    },

    toggleEmailModal() {
      this.toggleProperty('wantsToChangeEmail');
      this._resetProperties();
    },

    togglePasswordModal() {
      this.toggleProperty('wantsToChangePassword');
      this._resetProperties();
    },

    saveHandleChange() {
      set(this, 'isSavingHandle', true);

      this._checkCurrentPassword()
      .then(() => {
        const newHandle = get(this, 'newHandle');

        set(this, 'caster.handle', newHandle);

        get(this, 'caster').save()
        .then(() => {
          this.send('toggleHandleModal');
          get(this, 'notifications').success('Your username was saved');
        })
        .catch(() => {
          get(this, 'notifications').error('There was an error saving your username');
        });
      })
      .finally(() => {
        set(this, 'isSavingHandle', false);
      });
    },

    saveEmailChange() {
      set(this, 'isSavingEmail', true);

      this._checkCurrentPassword()
      .then(() => {
        const newEmail = get(this, 'newEmail');

        set(this, 'caster.email', newEmail);

        get(this, 'caster').save()
        .then(() => {
          this.send('toggleEmailModal');
          get(this, 'notifications').success('Your email was saved');
        })
        .catch(() => {
          get(this, 'notifications').error('There was an error saving your email');
        });
      })
      .finally(() => {
        set(this, 'isSavingEmail', false);
      });
    },

    savePasswordChange() {
      set(this, 'isSavingPassword', true);

      this._checkCurrentPassword()
      .then(() => {
        const caster = get(this, 'caster');
        const newPassword = get(this, 'newPassword');
        const newPasswordConfirmation = get(this, 'newPasswordConfirmation');

        setProperties(caster, {
          password: newPassword,
          passwordConfirmation: newPasswordConfirmation
        });

        caster.save()
        .then(() => {
          this.send('togglePasswordModal');
          get(this, 'notifications').success('Your new password was saved');
        })
        .catch(() => {
          get(this, 'notifications').error('There was an error saving your new password');
        });
      })
      .finally(() => {
        set(this, 'isSavingPassword', false);
      });
    },

    toggleEmailIsPrivate() {
      this.toggleProperty('emailIsPublic');

      const emailIsPublic = get(this, 'emailIsPublic');

      get(this, 'caster').save()
      .then(() => {
        const confirmMessage = emailIsPublic ? 'viewable by' : 'hidden from';
        get(this, 'notifications').success(`Your changes have been saved. Your email will be ${confirmMessage} other users`);
      })
      .catch(() => {
        get(this, 'notifications').error('There was a problem saving your preference');
        this.toggleProperty('emailIsPublic');
      });
    }
  }

});
