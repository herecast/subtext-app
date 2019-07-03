import { get, set, computed } from '@ember/object';
import { readOnly, notEmpty, alias, and, not } from '@ember/object/computed';
import { isPresent, isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['JobsForms-Owner'],
  classNameBindings: ['showOrganizationChoices:has-organizations', 'showOrganizationDropdown:open'],

  session: service(),

  model: null,
  isLoading: false,

  init() {
    if (get(this, 'model.isNew')) {
      set(this, 'isLoading', true);

      get(this, 'currentUser')
      .then(() => {
        this._setModelAttributes();
        set(this, 'isLoading', false);
      });
    }

    this._super(...arguments);
  },

  showOrganizationDropdown: false,

  hidePublishedTime: computed('model.{publishedAt,contentType}', function() {
    if (get(this, 'model.contentType') !== 'event') {
      return isBlank(get(this, 'model.publishedAt'));
    }

    return true;
  }),
  publishedTime: computed('hidePublishedTime', function() {
    return get(this, 'hidePublishedTime') ? false : get(this, 'model.publishedAtRelative');
  }),

  currentUser: readOnly('session.currentUser'),
  currentUserName: readOnly('currentUser.name'),
  managedOrganizations: readOnly('currentUser.managedOrganizations'),
  hasManagedOrganizations: notEmpty('managedOrganizations'),
  filteredManagedOrganizations: computed('managedOrganizations.@each.canPublishNews', function() {
    return (get(this, 'managedOrganizations') || []).filter((item) => {
      return get(item, 'canPublishNews');
    });
  }),
  organization: alias('model.organization'),
  hasOrganization: notEmpty('organization'),
  notLoading: not('isLoading'),
  showOrganizationChoices: and('hasManagedOrganizations', 'model.isNew', 'notLoading'),

  attributionImageUrl: computed('organization.name', 'currentUser.userImageUrl', function() {
    const organization = get(this, 'organization') || null;

    if (isPresent(organization) && isPresent(get(organization, 'name')) && parseInt(get(organization, 'id')) !== 398) {
      return get(organization, 'profileImageUrl');
    } else {
      return get(this, 'currentUser.userImageUrl');
    }
  }),

  attributionName: computed('organization.name', 'currentUser.name', function() {
    const organization = get(this, 'organization') || null;

    if (isPresent(organization) && isPresent(get(organization, 'name')) && parseInt(get(organization, 'id')) !== 398) {
      return get(organization, 'name');
    } else {
      return get(this, 'currentUser.name');
    }
  }),

  _setModelAttributes() {
    let model = get(this, 'model');
    const organization = get(this, 'organization') || {};

    set(model, 'organization', organization);
  },

  actions: {
    toggleOrganizationDropdown() {
      this.toggleProperty('showOrganizationDropdown');
    },

    chooseOrganization(organization) {
      if (organization === null) {
        organization = {};
      }

      set(this, 'model.organization', organization);
      set(this, 'showOrganizationDropdown', false);

      this._setModelAttributes();
    }
  }
});
