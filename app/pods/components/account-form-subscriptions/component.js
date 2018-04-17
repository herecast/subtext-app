import Ember from 'ember';

const { get, inject, computed } = Ember;

export default Ember.Component.extend({

  notify: inject.service('notification-messages'),
  tracking: inject.service(),

  // Should be instantiated when the component is rendered
  digests: [],

  digestsWithSubscriptions: computed('digests.@each.id', function() {
    return get(this, 'digests').map((digest) => {
      digest.loadSubscription();
      return digest;
    });
  }),

  alertGTM(digest) {
    if (get(digest, 'subscription')) {
      get(this, 'tracking').push({
        'event': 'dashboard-subscribe',
        'digest-name': get(digest, 'name')
      });
    } else {
      get(this, 'tracking').push({
        'event': 'dashboard-unsubscribe',
        'digest-name': get(digest, 'name')
      });
    }
  },

  actions: {
    toggleSubscription(digest) {
      const notify = get(this, 'notify');
      return digest.toggleSubscription().then(
        () => {
          const message = get(digest, 'subscription') ? 'Subscribed' : 'Unsubscribed';
          notify.success(message);
          this.alertGTM(digest);
        },
        () => notify.error('Unable to save your changes.')
      );
    }
  }
});
