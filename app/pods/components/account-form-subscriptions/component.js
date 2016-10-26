import Ember from 'ember';

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

  actions: {
    toggleSubscription(digest) {
      const toast = get(this, 'toast');
      return digest.toggleSubscription().then(
        () => {
          const message = get(digest, 'subscription') ? 'Subscribed' : 'Unsubscribed';
          toast.success(message);
        },
        () => toast.error('Unable to save your changes.')
      );
    }
  }
});
