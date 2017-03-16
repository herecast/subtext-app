import Ember from 'ember';

const { computed, set, get } = Ember;
const { oneWay } = computed;

export default Ember.Component.extend({
  classNames: ['dropdown Organization-Dropdown'],

  defaultName: oneWay('session.currentUser.name'),
  organizations: oneWay('session.currentUser.managedOrganizations'),
  organizationId: null,

  // Should be passed in when component is instantiated
  selection: null,
  helpMessage: null,

  actions: {
    selectOrganization(org) {
      org = org || {};

      set(this, 'selection', org);

      const updated = get(this, 'updated');
      if (updated) {
        updated(org);
      }
    }
  }
});
