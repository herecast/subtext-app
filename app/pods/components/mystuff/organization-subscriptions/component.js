import { get, set } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Mystuff-OrganizationSubscriptions'],

  searchValue: null,
  searchMatches: null,

  api: service(),
  subscriptionService: service('subscription'),

  organizationSubscriptions: readOnly('subscriptionService.organizationSubscriptions'),

  hasInputValue: notEmpty('searchValue'),

  _getMatches() {
    const searchValue = get(this, 'searchValue') || null;

    if (searchValue) {
      get(this, 'api').getOrganizationSubscriptionMatches(searchValue)
      .then((result) => {
        const organizations = result.organizations || [];
        set(this, 'searchMatches', organizations);
      });
    }
  },

  actions: {
    valueChanging() {
      debounce(this, '_getMatches', 200);
    },

    clearSearch() {
      set(this, 'searchValue', null);
    }
  }
});
