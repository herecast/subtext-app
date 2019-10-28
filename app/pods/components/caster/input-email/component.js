import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Validation from 'subtext-app/mixins/components/validation';
import Component from '@ember/component';

export default Component.extend(Validation, {
  api: service(),

  newEmail: null,
  isSavingEmail: false,
  isDisabled: false,
  inputClass: null,

  hasCheckedEmail: false,
  isCheckingEmail: false,
  newEmailIsUnique: false,

  _checkNewEmail() {
    set(this, 'newEmailIsUnique', false);

    if (get(this, 'hasNewEmail')) {
      const newEmail = get(this, 'newEmail');

      set(this, 'isCheckingEmail', true);

      get(this, 'api').isExistingEmail(newEmail)
      .then(() => {
        set(this, 'newEmailIsUnique', false);
      })
      .catch(({response}) => {
        if (parseInt(response.status) === 404) {
          set(this, 'newEmailIsUnique', true);
        }
      })
      .finally(() => {
        set(this, 'isCheckingEmail', false);

        if (!get(this, 'hasCheckedEmail')) {
          set(this, 'hasCheckedEmail', true);
        }
      });
    }
  },

  newEmailIsNotUnique: computed('hasNewEmail', 'newEmailIsUnique', 'hasCheckedEmail', function() {
    return get(this, 'hasCheckedEmail') && get(this, 'hasNewEmail') && !get(this, 'newEmailIsUnique');
  }),

  hasNewEmail: computed('newEmail', 'hasCheckedEmail', function() {
    const newEmail = get(this, 'newEmail') || null;

    return isPresent(newEmail) && this.hasValidEmail(newEmail);
  }),

  actions: {
    emailIsChanging() {
      debounce(this, '_checkNewEmail', 500);
    }
  }

});
