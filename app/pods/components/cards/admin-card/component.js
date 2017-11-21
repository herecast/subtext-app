import Ember from 'ember';

const {get, set, setProperties, isBlank, inject} = Ember;

export default Ember.Component.extend({
  classNames: ['AdminCard'],

  notify: inject.service('notification-messages'),

  organization: null,

  isAdmin: false,
  isActive: false,
  enableToggleButton: true,
  title: '',
  subtitle: '',

  editForm: null,
  formModel: null,
  isFormValid: false,
  isEditing: false,

  _showForm() {
    set(this, 'isEditing', true);
  },

  _hideForm() {
    set(this, 'isEditing', false);
  },

  saveChanges() {
    const notify = get(this, 'notify');
    const formModel = get(this, 'formModel');

    if (isBlank(formModel)) {
      notify.warning('No changes to save');
    } else if (get(this, 'isFormValid')) {
      const organization = get(this, 'organization');

      setProperties(organization, formModel);

      organization.save().then(
        () => {
          notify.success('Changes saved successfully');
          this._hideForm();
        },
        () => notify.error('Error: Could not save changes. Please try again!')
      );
    } else {
      notify.error('Error: All fields must be valid!');
    }
  },

  actions: {
    updateCardStatus(status) {
      this.updateCardStatus(status);
    },
    editContent() {
      this._showForm();
    },
    saveChanges() {
      this.saveChanges();
    },
    cancel() {
      this._hideForm();
    },
    formUpdated(isFormValid, formModel) {
      setProperties(this, {
        isFormValid,
        formModel
      });
    }
  }
});
