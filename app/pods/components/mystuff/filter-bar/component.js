import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'Mystuff-FilterBar',

  session: service(),

  organizations: [],
  types: [],

  activeOrganization: null,
  activeType: null,
  activeMyOrganization: computed('activeOrganization', function() {
    return get(this, 'activeOrganization') === false;
  }),

  myOrganization: {
    id: "false"
  },
  currentUser: computed.readOnly('session.currentUser'),

  hasOrganizations: computed.gt('organizations.length', 0),
  hasTypes: computed.gt('types.length', 0),

  chosenOrganizationId: '',
  chosenType: '',

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
