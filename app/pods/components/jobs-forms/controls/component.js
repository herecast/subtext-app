import { get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['JobsForms-Controls'],

  showSubmitButton: notEmpty('onSubmit'),
  showEditButton: notEmpty('onEdit'),
  showLaunchButton: notEmpty('onLaunch'),
  showSaveButton: notEmpty('onSave'),
  showRelaunchButton: notEmpty('onRelaunch'),

  actions: {
    submitForm() {
      if (get(this, 'onSubmit')) {
        get(this, 'onSubmit')();
      }
    },

    editForm() {
      if (get(this, 'onEdit')) {
        get(this, 'onEdit')();
      }
    },

    saveForm() {
      if (get(this, 'onSave')) {
        get(this, 'onSave')();
      }
    },

    launch() {
      if (get(this, 'onLaunch')) {
        get(this, 'onLaunch')();
      }
    },

    relaunch() {
      if (get(this, 'onRelaunch')) {
        get(this, 'onRelaunch')();
      }
    }
  }

});
