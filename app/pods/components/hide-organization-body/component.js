import { get, set, computed, setProperties } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'HideOrganizationButton',

  organizationHidesService: service('organization-hides'),
  organizationHides: readOnly('organizationHidesService.organizationHides'),
  router: service(),

  organization: null,
  organizationId: readOnly('organization.id'),
  organizationName: readOnly('organization.name'),
  organizationProfileImageUrl: readOnly('organization.profileImageUrl'),
  contentId: null,

  showSuccess: false,
  flagType: null,
  hasFlagType: notEmpty('flagType'),
  isInvalid: false,
  wantsToHideOrg: false,
  hasHiddenOrg: false,
  afterHide: null,
  afterCancel: null,
  additionToMessage: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      flagTypes: ['Not relevant to me', 'Not relevant to my location', 'Offensive to me', 'I see too much by this author']
    });
  },

  _resetProperties() {
    setProperties(this, {
      isInvalid: false,
      flagType: null,
      wantsToHideOrg: false
    });
  },

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
    close() {
      this._resetProperties();

      if (get(this, 'hasHiddenOrg')) {
        const organizationId = get(this, 'organizationId');

        get(this, 'organizationHidesService').removeOrganizationContent(organizationId)
        .then(() => {
          if (get(this, 'afterHide')) {
            get(this, 'afterHide')();
          } else {
            get(this, 'router').transitionTo('feed');
          }
        });
      } else {
        if (get(this, 'afterCancel')) {
          get(this, 'afterCancel')();
        }
      }
    },

    hide() {
      const organization = get(this, 'organization');
      const contentId = get(this, 'contentId');
      const flagType = get(this, 'flagType');

      if (isPresent(flagType)) {
        get(this, 'organizationHidesService').hide(organization, contentId, flagType)
        .then(() => {
          setProperties(this, {
            'showSuccess': true,
            'hasHiddenOrg': true
          });
        });
      } else {
        set(this, 'isInvalid', true);
      }
    }
  }
});
