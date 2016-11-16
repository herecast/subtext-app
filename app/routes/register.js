import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { set } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Join',

  model(params, transition) {
    const promise = this.store.findAll('digest');

    if ('selectedDigest' in transition.queryParams) {
      promise.then((digests) => {
        const digest = digests.findBy('id', transition.queryParams.selectedDigest);
        if (digest) {
          set(digest, 'checked', true);
        }
      });
    }

    return promise;
  }
});
