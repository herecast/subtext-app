import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'HideLocationButton',

  modals: service(),

  location: null,
  contentId: null,

  afterHide: null,

  wantsToHideLocation: false,

  _openSignInModal() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to manage your feed preferences.'
    });
  },

  actions: {
    clickedHideButton() {
      if (get(this, 'session.isAuthenticated')) {
        set(this, 'wantsToHideLocation', true);
      } else {
        this._openSignInModal();
      }
    },

    afterHide() {
      if (get(this, 'afterHide')) {
        get(this, 'afterHide')();
      }

      set(this, 'wantsToHideLocation', false);
    },

    afterCancel() {
      set(this, 'wantsToHideLocation', false);
    }
  }
});
