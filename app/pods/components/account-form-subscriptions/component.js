import Ember from 'ember';
/* global dataLayer */

const { get, inject, computed } = Ember;

export default Ember.Component.extend({

  toast: inject.service(),

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
      const toast = get(this, 'toast');
      return digest.toggleSubscription().then(
        () => {
          const message = get(digest, 'subscription') ? 'Subscribed' : 'Unsubscribed';
          toast.success(message);
          this.alertGTM(get(digest, 'subscription'));
        },
        () => toast.error('Unable to save your changes.')
      );
    }
  }
});
