import { readOnly, gt } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'Mystuff-FilterBar',

  session: service(),

  activeOrganization: null,
  activeType: null,
  chosenOrganizationId: '',
  chosenType: '',
  organizations: null,
  types: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      myOrganization: {
        id: "false"
      }
    });
  },

  activeMyOrganization: computed('activeOrganization', function() {
    return get(this, 'activeOrganization') === false;
  }),

  currentUser: readOnly('session.currentUser'),

  hasOrganizations: gt('organizations.length', 0),
  hasTypes: gt('types.length', 0),

  actions: {
    changeOrganization(organization) {
      if (get(this, 'onChangeOrganizationId')) {
        get(this, 'onChangeOrganizationId')(get(organization, 'id'));
      }
    },

    resetOrganization() {
      if (get(this, 'onChangeOrganizationId')) {
        get(this, 'onChangeOrganizationId')('');
      }
    },

    changeType(type) {
      if (get(this, 'onChangeType')) {
        get(this, 'onChangeType')(type);
      }
    },

    resetType() {
      if (get(this, 'onChangeType')) {
        get(this, 'onChangeType')('');
      }
    },
  }
});
