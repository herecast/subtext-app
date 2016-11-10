import Ember from 'ember';
/* global dataLayer */

const { get, inject, computed } = Ember;

export default Ember.Component.extend({

  notify: inject.service('notification-messages'),

  // Should be instantiated when the component is rendered
  digests: [],

  digestsWithSubscriptions: computed('digests.@each.id', function() {
    return get(this, 'digests').map((digest) => {
      digest.loadSubscription();
      return digest;
    });
  }),

  alertGTM(message) {
    if (typeof dataLayer !== 'undefined') {
      if (message) {
        dataLayer.push({
          'event': 'dashboard-subscribe'
        });
      } else {
        dataLayer.push({
          'event': 'dashboard-unsubscribe'
        });
      }
    }
  },

  actions: {
    toggleSubscription(digest) {
      const notify = get(this, 'notify');
      return digest.toggleSubscription().then(
        () => {
          const message = get(digest, 'subscription') ? 'Subscribed' : 'Unsubscribed';
          notify.success(message);
          this.alertGTM(get(digest, 'subscription'));
        },
        () => notify.error('Unable to save your changes.')
      );
    }
  }
});
