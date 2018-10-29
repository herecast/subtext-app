import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  notify: service('notification-messages'),
  tracking: service(),

  init() {
    this._super(...arguments);
    set(this, 'digeste', []);
  },

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
