import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const { get, set, setProperties, computed, isBlank, inject, run } = Ember;

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  classNames: ['AccountFormDetails'],

  notify: inject.service('notification-messages'),

  // Component should be instantiated with currentUser object
  model: null,
  avatarImage: computed.alias('model.avatarImage'),

  showPasswordForm: false,
  imageFormVisible: false,

  displayAvatarImageForm: computed('imageFormVisible', function() {
    return get(this, 'imageFormVisible') || isBlank(get(this, 'model.userImageUrl'));
  }),

  validateForm() {
    this.validatePresenceOf('model.name');
    this.validateImage('avatarImage');

    const showPasswordForm = get(this, 'showPasswordForm');
    if (showPasswordForm) {
      this.validatePasswords();
    }
  },

  validatePasswords() {
    const password = get(this, 'model.password');
    if (this.hasValidPassword(password)) {
      const passwordConfirmation = get(this, 'model.passwordConfirmation');
      if (password !== passwordConfirmation) {
        set(this, 'errors.passwordConfirmation', 'Both password fields must match');
        return false;
      } else {
        set(this, 'errors.passwordConfirmation', null);
        delete get(this, 'errors')['passwordConfirmation'];
        return true;
      }
    } else {
      return false;
    }
  },

  submit(e) {
    e.preventDefault();
    const notify = get(this, 'notify');

    if (this.isValid()) {
      const model = get(this, 'model');
      model.save().then(
        () => {
          notify.success('Successfully saved changes.');
          setProperties(this, {
            showPasswordForm: false,
            imageFormVisible: false
          });
        },
        () => notify.error('Error: Unable to save changes.'));
    } else {
      notify.error('Error: Please correct the errors in the form.');
    }
  },

  actions: {
    notifyChange() {
      run.debounce(this, this.validateForm, 900);
    },
    togglePasswordForm() {
      this.toggleProperty('showPasswordForm');
    },
    showAvatarImageForm() {
      set(this, 'imageFormVisible', true);
    }
  }
});
