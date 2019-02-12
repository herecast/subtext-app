import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  api: service(),
  fastboot: service(),
  notify: service('notification-messages'),
  session: service(),
  store: service(),

  organizationSubscriptions: null,
  isLoadingOrgId: null,

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  init() {
    this._super(...arguments);
    get(this, 'session').on('authenticationSucceeded', this, '_getSubscriptions');
    this._getSubscriptions();
  },

  _getSubscriptions() {
    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      get(this, 'currentUser').then(() => {
        const organizationSubscriptions = get(this, 'store').peekAll('organization-subscription');
        set(this, 'organizationSubscriptions', organizationSubscriptions);
      });
    }
  },

  _getSubscription(organizationId) {
    const organizationSubscriptions = get(this, 'organizationSubscriptions') || [];

    const matchingSubscription = organizationSubscriptions.find((organizationSubscription) => {
      if (isPresent(organizationSubscription)) {
        return parseInt(organizationId) === parseInt(get(organizationSubscription, 'organizationId'));
      }
      return false;
    });

    return matchingSubscription || null;
  },

  _addSubscriptionToCurrentUser(organizationSubscription) {
    if (get(this, 'session.isAuthenticated')) {
      get(this, 'currentUser').then(currentUser => {
        const organizationSubscriptions = get(this, 'organizationSubscriptions');
        organizationSubscriptions.pushObject(organizationSubscription);
        set(currentUser, 'organizationSubscriptions', organizationSubscriptions);
      });
    }
  },

  _addToOrganizationSubscriberCount(organizationId, addTo=0) {
    this._getOrganization(organizationId)
    .then((organization) => {
      const activeSubscriberCount = get(organization, 'activeSubscriberCount');
      set(organization, 'activeSubscriberCount', activeSubscriberCount + addTo);
    });
  },

  _getOrganization(organizationId) {
    return new Promise((resolve) => {
      let organization = get(this, 'store').peekRecord('organization', organizationId);

      if (isPresent(get(organization, 'id'))) {
        resolve(organization);
      } else {
        return get(this, 'store').findRecord('organization', organizationId);
      }
    });
  },

  subscribe(organizationId, updateOrganization=true) {
    if (get(this, 'session.isAuthenticated')) {
      set(this, 'isLoadingOrgId', organizationId);

      const newSubscription = get(this, 'store').createRecord('organization-subscription', {organizationId});

      return newSubscription.save()
      .then(() => {
        this._getSubscriptions();
        get(this, 'notify').success(`You're subscribed! You will now receive an email alert when they publish a new post.`);
        if (updateOrganization) {
          this._addToOrganizationSubscriberCount(organizationId, 1);
        }
      })
      .catch(() => {
        get(this, 'notify').error('There was a problem subscribing. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingOrgId', null);
      });
    }
  },

  unsubscribe(organizationId, updateOrganization=true) {
    set(this, 'isLoadingOrgId', organizationId);

    const subscription = this._getSubscription(organizationId);

    if (isPresent(subscription)) {
      return subscription.destroyRecord()
      .then(() => {
        get(this, 'notify').success(`You are unsubscribed and will no longer receive notifications from this publisher.`);
        if (updateOrganization) {
          this._addToOrganizationSubscriberCount(organizationId, -1);
        }
      })
      .catch(() => {
        get(this, 'notify').error('There was a problem unsubscribing. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingOrgId', null);
      });
    }
  }
});
