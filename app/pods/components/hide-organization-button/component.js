import { get, set, computed } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'HideOrganizationButton',

  organizationHidesService: service('organization-hides'),
  organizationHides: readOnly('organizationHidesService.organizationHides'),
  fastboot: service(),
  modals: service(),

  organization: null,
  contentId: null,
  afterHide: null,

  wantsToHideOrg: false,
  additionToMessage: null,

  _openSignInModal() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to manage your feed preferences.'
    });
  },

  hideOnThisOrganization: computed('organizationHides.[]', 'organizationId', function() {
    const organizationHides = get(this, 'organizationHides') || [];
    const organizationId = get(this, 'organizationId') || null;

    if (organizationHides.length && isPresent(organizationId)) {
      const hideOnThisOrganization = organizationHides.find((organizationHide) => {
        return parseInt(organizationId) === parseInt(get(organizationHide, 'organizationId'));
      });

      return hideOnThisOrganization || null;
    }

    return null;
  }),

  hasHiddenThisOrg: notEmpty('hideOnThisOrganization'),

  actions: {
    clickedHideButton() {
      if (get(this, 'session.isAuthenticated')) {
        set(this, 'wantsToHideOrg', true);
      } else {
        this._openSignInModal();
      }
    },

    afterHide() {
      if (get(this, 'afterHide')) {
        get(this, 'afterHide')();
      }
      
      set(this, 'wantsToHideOrg', false);
    },

    afterCancel() {
      set(this, 'wantsToHideOrg', false);
    }
  }
});
