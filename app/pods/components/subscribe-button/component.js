import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { oneWay, readOnly, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  fastboot: service(),
  modals: service(),
  session: service(),
  subscriptionService: service('subscription'),

  organization: null,
  organizationId: oneWay('organization.id'),
  updateOrganization: true,

  wantsToUnsubscribe: false,

  organizationSubscriptions: readOnly('subscriptionService.organizationSubscriptions'),

  subscriptionToThisOrganization: computed('organizationSubscriptions.[]', 'organizationId', function() {
    const organizationSubscriptions = get(this, 'organizationSubscriptions') || [];
    const organizationId = get(this, 'organizationId') || null;

    if (organizationSubscriptions.length && isPresent(organizationId)) {
      const subscriptionToThisOrganization = organizationSubscriptions.find((organizationSubscription) => {
        return parseInt(organizationId) === parseInt(get(organizationSubscription, 'organizationId'));
      });

      return subscriptionToThisOrganization || null;
    }
    
    return null;
  }),

  isSubscribed: notEmpty('subscriptionToThisOrganization'),
  isLoading: computed('subscriptionService.isLoadingOrgId', 'organizationId', function() {
    const isLoadingOrgId = get(this, 'subscriptionService.isLoadingOrgId');
    const organizationId = get(this, 'organizationId');

    return parseInt(isLoadingOrgId) === parseInt(organizationId);
  }),

  actions: {
    subscribe() {
      if (get(this, 'session.isAuthenticated')) {
        get(this, 'subscriptionService').subscribe(get(this, 'organizationId'), get(this, 'updateOrganization'));
      } else {
        get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
      }
    },

    startUnsubscribe() {
      set(this, 'wantsToUnsubscribe', true);
    },

    cancelUnsubscribe() {
      set(this, 'wantsToUnsubscribe', false);
    },

    unsubscribe() {
      set(this, 'wantsToUnsubscribe', false);
      get(this, 'subscriptionService').unsubscribe(get(this, 'organizationId'), get(this, 'updateOrganization'));
    }
  }
});
